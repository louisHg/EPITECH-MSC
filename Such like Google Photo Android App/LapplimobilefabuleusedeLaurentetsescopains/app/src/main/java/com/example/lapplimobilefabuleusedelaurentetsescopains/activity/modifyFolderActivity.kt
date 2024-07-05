package com.example.lapplimobilefabuleusedelaurentetsescopains.activity

import android.content.ContentValues.TAG
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.lapplimobilefabuleusedelaurentetsescopains.R
import com.example.lapplimobilefabuleusedelaurentetsescopains.databinding.ActivityModifyFolderBinding
import com.google.android.gms.tasks.Task
import com.google.android.gms.tasks.Tasks
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.DocumentReference
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.QuerySnapshot
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.storage.StorageReference
import kotlinx.coroutines.*
import kotlinx.coroutines.tasks.await
import java.util.concurrent.CompletableFuture

class ModifyFolderActivity : AppCompatActivity() {

    private lateinit var binding: ActivityModifyFolderBinding
    private lateinit var firebaseFirestore: FirebaseFirestore
    private lateinit var auth: FirebaseAuth
    private lateinit var storageRef: StorageReference

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityModifyFolderBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val folderNameLayout: TextView = findViewById(R.id.folderName)
        val folderIdLayout: TextView = findViewById(R.id.idFolder)

        val bundle: Bundle? = intent.extras
        val idFolder = bundle!!.getString("idFolder")
        val folderName = bundle!!.getString("folderName")

        folderIdLayout.text = idFolder
        folderNameLayout.text = folderName

        initVars()
        registerClickEvents()
    }

    private fun registerClickEvents() {
        binding.addAUser.setOnClickListener {
            addAUser()
        }
        binding.deleteAUser.setOnClickListener {
            CoroutineScope(Dispatchers.Main).launch {
                deleteAUser()
            }
        }
        binding.deleteFolder.setOnClickListener {
            CoroutineScope(Dispatchers.Main).launch {
                deleteTheFolder()
                val intent = Intent(this@ModifyFolderActivity, HomeActivity::class.java)
                startActivity(intent)
                finish()
            }
        }
    }

    /**
     * Delete the folder and delete all resources linked with this ressources
     * Like storage portion and data in database
     * */
    private suspend fun deleteTheFolder() = withContext(Dispatchers.IO) {
        /* Necessaire pour impacter la vue pendant des actions asyncs */
        runOnUiThread {
            binding.progressBar.visibility = View.VISIBLE
        }
        val idFolder: String = binding.idFolder.text.toString()
        // Supprime tous les documents de la collection Firebase "folders" ayant l'identifiant de dossier idFolder
        val documentsToDelete = mutableListOf<DocumentReference>()
        FirebaseFirestore.getInstance().collection("folders")
            .whereEqualTo("folderId", idFolder)
            .get()
            .addOnSuccessListener { results ->
                for (result in results) {
                    documentsToDelete.add(result.reference)
                }
                // Supprime les documents dans une autre boucle for
                for (documentRef in documentsToDelete) {
                    documentRef.delete()
                        .addOnSuccessListener {
                            Log.d(TAG, "Document successfully deleted!")
                        }.addOnFailureListener { e ->
                            Log.w(TAG, "Error deleting document", e)
                        }
                }
            }
            .addOnFailureListener { e ->
                Log.w(TAG, "Error querying documents", e)
            }
            .await()

        // Supprime tous les fichiers de stockage du dossier idFolder
        val store = FirebaseStorage.getInstance().reference.child(idFolder)
        store.listAll()
            .addOnSuccessListener { listResult ->
                val allFiles = listResult.items
                allFiles.forEach { file ->
                    file.delete()
                        .addOnSuccessListener {
                            Log.d(TAG, "File successfully deleted!")
                        }.addOnFailureListener { e ->
                            Log.w(TAG, "Error deleting file", e)
                        }
                }
            }
            .addOnFailureListener { exception ->
                Log.w(TAG, "Error listing files in storage", exception)
            }
            .await()

        // Supprime la collection Firebase ayant pour nom idFolder
        FirebaseFirestore.getInstance().collection(idFolder)
            .get()
            .addOnSuccessListener { queryDocumentSnapshots: QuerySnapshot ->
                val batch = FirebaseFirestore.getInstance().batch()
                for (documentSnapshot in queryDocumentSnapshots) {
                    val documentRef = documentSnapshot.reference
                    batch.delete(documentRef)
                }
                batch.commit()
                    .addOnSuccessListener {
                        // Tous les documents ont été supprimés
                        // Supprime maintenant la collection elle-même
                        FirebaseFirestore.getInstance().collection(idFolder)
                            .document(idFolder)
                            .delete()
                            .addOnSuccessListener {
                                Log.d(TAG, "Collection successfully deleted")
                            }
                            .addOnFailureListener { e ->
                                Log.w(TAG, "Error deleting collection", e)
                            }
                    }
                    .addOnFailureListener { e ->
                        Log.w(TAG, "Error deleting documents", e)
                    }
            }
            .addOnFailureListener { e ->
                Log.w(TAG, "Error querying documents", e)
            }
            .await()
        runOnUiThread {
            binding.progressBar.visibility = View.INVISIBLE
        }
    }


    /**
     * Delete a user who add the access to saw the picture
     * */
    private suspend fun deleteAUser() {
        binding.progressBar.visibility = View.VISIBLE
        val email: String = binding.textEmailtoDelete.text.toString()
        val idFolder: String = binding.idFolder.text.toString()
        val results = firebaseFirestore.collection("folders")
            .whereEqualTo("folderId", idFolder)
            .whereEqualTo("folderOwner", auth.currentUser!!.uid)
            .get().await()
        if (results != null) {
            for (result in results) {
                deleteTheUser(result.data, email, idFolder)
                Toast.makeText(this, "User succesfully delete", Toast.LENGTH_SHORT).show()
                Log.d(TAG, "User succesfully delete")
            }
        } else {
            Log.w(TAG, "Not exist")
            binding.progressBar.visibility = View.INVISIBLE
        }
        binding.textEmailtoDelete.text.clear()
        binding.progressBar.visibility = View.INVISIBLE
    }

    /**
     * Modify the folder accces list then delete the user
     * */
    private suspend fun deleteTheUser(data: Map<String, Any>, email: String, idFolder: String) {
        var userAccess = data["folderAccess"] as HashMap<String, String>
        val userId = coroutineScope {
            getUserId(email)
        }
        if (userId != null) {
            userAccess.remove(email, userId)
        } else {
            Log.w(TAG, "L'utilisateur n'existe pas")
            binding.progressBar.visibility = View.INVISIBLE
        }
        val updates = mapOf<String, Any>(
            "folderAccess" to userAccess
        )

        val snapshot = firebaseFirestore.collection("folders")
            .whereEqualTo("folderId", idFolder)
            .whereEqualTo("folderOwner", auth.currentUser!!.uid)
            .get().await()
        for (document in snapshot.documents) {
            document.reference.update(updates)
        }
    }


    /**
     * After saw the content of the folder we update the user and delete one
     * */
    private fun addAUser() {
        binding.progressBar.visibility = View.VISIBLE
        val email: String = binding.textEmailtoAdd.text.toString()
        val idFolder: String = binding.idFolder.text.toString()
        firebaseFirestore.collection("folders")
            .whereEqualTo("folderId", idFolder)
            .whereEqualTo("folderOwner", auth.currentUser!!.uid)
            .get().addOnSuccessListener { results ->
                if (results != null) {
                    for (result in results) {
                        GlobalScope.launch {
                            insertTheUser(result.data, email, idFolder)
                            GlobalScope.launch {
                                insertTheUser(result.data, email, idFolder)
                                withContext(Dispatchers.Main) {
                                    Toast.makeText(this@ModifyFolderActivity, "User successfully added", Toast.LENGTH_SHORT).show()
                                    Log.d(TAG, "User successfully added")
                                }
                            }
                        }
                    }
                } else {
                    Log.w(TAG, "Not exist")
                    binding.progressBar.visibility = View.INVISIBLE
                }
            }
        binding.textEmailtoAdd.text.clear()
        binding.progressBar.visibility = View.INVISIBLE
    }


    /**
     * After saw the content of the folder we update the user and add one
     * */
    private suspend fun insertTheUser(
        data: MutableMap<String, Any>,
        email: String,
        idFolder: String
    ) {
        var userAccess = data["folderAccess"] as HashMap<String, String>
        val userId = getUserId(email)
        if (userId != null) {
            userAccess.putIfAbsent(email, userId)
        } else {
            Log.w(TAG, "L'utilisateur n'existe pas")
            binding.progressBar.visibility = View.INVISIBLE
            return
        }
        val updates = mapOf<String, Any>(
            "folderAccess" to userAccess
        )

        val snapshot = firebaseFirestore.collection("folders")
            .whereEqualTo("folderId", idFolder)
            .whereEqualTo("folderOwner", auth.currentUser!!.uid)
            .get().await()
        for (document in snapshot.documents) {
            document.reference.update(updates)
        }
    }

    /**
     * We find the userId to add or erase it into the folder
     * */
    private suspend fun getUserId(email: String): String? {
        val idUser = CompletableDeferred<String?>()
        firebaseFirestore.collection("users")
            .whereEqualTo("login", email)
            .get()
            .addOnSuccessListener { results ->
                var userId: String? = null
                for (result in results) {
                    userId = result.getString("userId")
                    if (userId != null) {
                        break
                    }
                }
                idUser.complete(userId)
            }
            .addOnFailureListener {
                idUser.completeExceptionally(it)
                binding.progressBar.visibility = View.INVISIBLE
            }.await()
        return idUser.await()
    }


    private fun initVars() {
        firebaseFirestore = FirebaseFirestore.getInstance()
        auth = FirebaseAuth.getInstance()

        val folderId: String = binding.idFolder.text.toString()
        storageRef = FirebaseStorage.getInstance().reference.child(folderId)
    }

}