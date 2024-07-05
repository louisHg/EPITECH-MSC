package com.example.lapplimobilefabuleusedelaurentetsescopains.activity

import android.annotation.SuppressLint
import android.content.ContentValues.TAG
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.AdapterView
import android.widget.Spinner
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.lapplimobilefabuleusedelaurentetsescopains.databinding.ActivityHomeBinding
import com.example.lapplimobilefabuleusedelaurentetsescopains.kotlinClass.Folder
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import java.util.*


class HomeActivity : AppCompatActivity() {

    private lateinit var binding: ActivityHomeBinding
    private lateinit var firebaseFirestore: FirebaseFirestore
    private var mList = mutableListOf<String>()
    private lateinit var adapter: FolderApater
    private lateinit var auth: FirebaseAuth
    private var nbColumn: Int = 2

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Initialize activity_home layout
        binding = ActivityHomeBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Initialization of the firebase db
        initVars()

        auth = FirebaseAuth.getInstance()
        if(auth.currentUser != null){
            // All actions to handle activity main
            registerClickEvents()
        }

        val spinner: Spinner = findViewById(binding.spinner.id)
        spinner.setSelection(1) // sélectionne l'élément à l'index 1 (2ème élément dans la liste)

    }

    private fun registerClickEvents() {
        getFolders()
        addFolder()
        logOut()
        changeNbColomn()
    }

    /**
    *
    * This method is called when the user selects a new value from the spinner.
    * It sets the nbColumn variable to the selected value and updates the RecyclerView accordingly.
    *
    * */
    private fun changeNbColomn() {
        binding.spinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: View?, position: Int, id: Long) {
                val selectedNumber = parent.getItemAtPosition(position) as String
                nbColumn = selectedNumber.toInt()
                updateRecyclerView()
            }

            override fun onNothingSelected(parent: AdapterView<*>) {}
        }
    }

    /** Allowed to update recycler view aspect */
    private fun updateRecyclerView() {
        binding.recyclerView.layoutManager = GridLayoutManager(this, nbColumn, GridLayoutManager.VERTICAL, false)
        adapter.notifyDataSetChanged()
    }

    /** Redirect to login (classic logout) */
    private fun logOut() {
        binding.logOut.setOnClickListener {
            FirebaseAuth.getInstance().signOut()
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
        }
    }

    /**
     *
     *
     * This method is used to add a new folder to the user's collection of folders.
     * It is called when the user clicks on the "add folder" button in the UI.
     * If the folder name is empty, a toast message is displayed prompting the user to enter a name.
     * Otherwise, a progress bar is displayed to indicate that the folder is being created.
     * A new folder object is created using the folder name, a unique ID, and user access information.
     * The new folder is then added to the Firebase Firestore database under the "folders" collection.
     * Upon successful completion, the UI is updated to show the new folder and the progress bar is hidden.
     * Finally, the method finishes the activity and starts a new instance to refresh the UI.
     *
     */
    private fun addFolder() {
        binding.addFolder.setOnClickListener {
            if(binding.folderName.text.isEmpty()){
                Toast.makeText(this, "Please enter a foler name", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            binding.progressBar.visibility = View.VISIBLE

            val folderName: String = binding.folderName.text.toString()
            val userAccess : HashMap<String, String> = HashMap<String, String> ()
            val folderId: String = UUID.randomUUID().toString() + System.nanoTime()

            val folder = Folder( folderId, folderName, auth.currentUser!!.uid, userAccess )
            // Rework insert in db (no map, an object with acces and right and a list (array maybe) of user

            firebaseFirestore.collection("folders").add(folder).addOnCompleteListener { firestoreTask ->

                if (firestoreTask.isSuccessful){
                    Log.d(TAG, "Uploaded Successfully")
                }
                else{
                    Log.w(TAG, "Not upload")
                }
                binding.progressBar.visibility = View.GONE
                binding.folderName.text.clear()

                binding.recyclerView.apply {
                    layoutManager =
                        LinearLayoutManager(this@HomeActivity, RecyclerView.VERTICAL, false)
                }
                finish()
                startActivity(intent)
            }
        }
    }


    /** We saw if the user is connected in the application and if not we redirect on login view
     * Otherwise we load the recyclerView
     * */
    private fun initVars() {
        firebaseFirestore = FirebaseFirestore.getInstance()

        // If user not connected redirect to login
        auth = FirebaseAuth.getInstance()
        if(auth.currentUser == null){
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
        }

        binding.recyclerView.setHasFixedSize(true)
        binding.recyclerView.layoutManager = GridLayoutManager(this, nbColumn, GridLayoutManager.VERTICAL, false)

        adapter = FolderApater(mList,
        {
            goIntoAFolder(it)
        },
        {
            modifyAFolder(it)
        }
        )
        binding.recyclerView.adapter = adapter
    }


    /** Used to set the parameters to send to ImageFolderPage */
    private fun modifyAFolder(it: String) {
        binding.progressBar.visibility = View.VISIBLE

        val intent = Intent(this@HomeActivity, ModifyFolderActivity::class.java)

        val folderList: List<String> = it.split(",")

        val folderWithName: String = folderList.find { folder -> folder.contains("folderName") }.toString()
        val folderName: String = folderWithName.split("=")[1].split("}")[0]

        val folderWithId: String = folderList.find { folder -> folder.contains("folderId") }.toString()
        val folderId: String = (folderWithId.split("="))[1]

        intent.putExtra("idFolder", folderId)
        intent.putExtra("folderName", folderName)

        binding.progressBar.visibility = View.GONE

        startActivity(intent)
    }

    /** Send the parameters to send when we redirect to modifyFolderActivity */
    private fun goIntoAFolder(it: String) {
        binding.progressBar.visibility = View.VISIBLE

        val intent = Intent(this@HomeActivity, ImagesFolderActivity::class.java)

        val folderList: List<String> = it.split(",")

        val folderWithName: String = folderList.find { folder -> folder.contains("folderName") }.toString()
        val folderName: String = folderWithName.split("=")[1].split("}")[0]

        val folderWithId: String = folderList.find { folder -> folder.contains("folderId") }.toString()
        val folderId: String = (folderWithId.split("="))[1]

        intent.putExtra("idFolder", folderId)
        intent.putExtra("folderName", folderName)

        binding.progressBar.visibility = View.GONE

        startActivity(intent)
    }

    /** Allowed us to show the folder if we can see it and plus if we can modify it (owner) */
    @SuppressLint("NotifyDataSetChanged")
    private fun getFolders(){
        binding.progressBar.visibility = View.VISIBLE
        firebaseFirestore.collection("folders")
            .get().addOnSuccessListener {
                for(i in it){
                    val folder = i.data.toString()
                    val folderAccess = i.data["folderAccess"] as HashMap<String, String>
                    if(i.data["folderOwner"].toString() == auth.currentUser!!.uid) {
                        mList.add(folder)
                    }
                    else {
                        for (userId in folderAccess.values) {
                            if (userId == auth.currentUser!!.uid) {
                                mList.add(folder)
                            }
                        }
                    }
                }
                adapter.notifyDataSetChanged()
                binding.progressBar.visibility = View.GONE
            }
    }

}