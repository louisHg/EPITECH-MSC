package com.example.lapplimobilefabuleusedelaurentetsescopains.activity

import android.content.ContentValues.TAG
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.util.Log
import android.view.View
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import com.example.lapplimobilefabuleusedelaurentetsescopains.R
import com.example.lapplimobilefabuleusedelaurentetsescopains.databinding.ActivityFullImagesBinding
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.storage.StorageReference
import com.squareup.picasso.Picasso
import java.io.File
import java.io.FileOutputStream

class FullImagesActivity : AppCompatActivity() {
    private lateinit var binding: ActivityFullImagesBinding
    private lateinit var firebaseFirestore: FirebaseFirestore
    private lateinit var storageRef: StorageReference
    private lateinit var image: String

    /**
     * Called when the activity is starting. This is where most initialization should go:
     * calling `setContentView(int)` to inflate the activity's UI, initializing variables,
     * and binding UI elements to variables.
     *
     * @param savedInstanceState If the activity is being re-initialized after previously
     *     being shut down then this Bundle contains the data it most recently supplied
     *     in [Activity.onSaveInstanceState]. Note: Otherwise it is null.
     */
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Inflate the activity's UI
        binding = ActivityFullImagesBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val imageNameLayout: TextView = findViewById(binding.imageName.id)
        val imageDateLayout: TextView = findViewById(binding.imageDate.id)
        val imageDescriptionLayout: TextView = findViewById(binding.imageDescription.id)

        val bundle: Bundle? = intent.extras
        image = bundle!!.getString("uriParam").toString()
        val folderId = bundle!!.getString("idFolder")
        val folderName = bundle!!.getString("folderName")
        val pictureName = bundle!!.getString("pictureName")
        val pictureDate = bundle!!.getString("pictureDate")
        val pictureDescription = bundle!!.getString("pictureDescription")

        // Initialization of the firebase db link
        initVars(folderId)

        // Load image into ImageView
        val imageLayout: ImageView = findViewById(R.id.imageViewFullImages)

        imageNameLayout.text = pictureName
        imageDateLayout.text = pictureDate
        imageDescriptionLayout.text = pictureDescription

        Picasso.get().load(image).into(imageLayout)

        registerClickEvents(image, folderId, pictureName, folderName)
    }

    /**
     * Initializes the variables used for the connection to the Firestore database of Firebase.
     * */
    private fun initVars(folderId: String?) {
        firebaseFirestore = FirebaseFirestore.getInstance()
        storageRef = FirebaseStorage.getInstance().reference.child(folderId.toString())
    }

    private fun registerClickEvents(
        image: String?,
        folderId: String?,
        pictureName: String?,
        folderName: String?
    ) {
        binding.buttonDelete.setOnClickListener {
            deleteTheImage(image, folderId, folderName)
        }
        binding.buttonUpdate.setOnClickListener {
            updateImage(image, folderId, pictureName)
        }
    }

    /**
     * This method updates an image in Firebase Storage and Firestore.
     * @param uri: The URI of the image to update.
     * @param folderId: The ID of the folder where the image is located.
     * @param folderName: The name of the folder where the image is located.
     */
    private fun updateImage(
        uri: String?,
        folderId: String?,
        folderName: String?
    ) {
        binding.progressBar.visibility = View.VISIBLE
        // Retrieve the reference to the collection corresponding to the folder
        val collectionRef = firebaseFirestore.collection(folderId.toString())
        // Create a query to retrieve the document corresponding to the image URI
        val query = collectionRef.whereEqualTo("pictureUri", uri.toString())
        storageRef = storageRef.child(System.currentTimeMillis().toString())
        // Initialize a variable to store the URI of the new image

        // Execute the query to retrieve the documents corresponding to the image URI
        query.get().addOnSuccessListener { documents ->
            // For each retrieved document, update the fields of the image
            for (document in documents) {
                val updates = hashMapOf<String, Any>(
                    "pictureName" to binding.imageName.text.toString(),
                    "pictureUri" to uri.toString(),
                    "pictureDate" to binding.imageDate.text.toString(),
                    "pictureDescription" to binding.imageDescription.text.toString()
                )
                // Update the corresponding document with the new fields of the image
                document.reference.update(updates)
                    .addOnSuccessListener {
                        // If the update is successful, display a success message
                        Log.w(TAG, "Image mis à jour avec succès")

                        binding.progressBar.visibility = View.GONE
                        val intent =
                            Intent(this@FullImagesActivity, ImagesFolderActivity::class.java)
                        intent.putExtra("idFolder", folderId)
                        intent.putExtra("folderName", folderName)
                        startActivity(intent) // restart the activity with the new Intent

                    }
                    .addOnFailureListener { e ->
                        // Otherwise, display an error message
                        Log.w(TAG, "Erreur lors de la mise à jour des champs", e)
                        binding.progressBar.visibility = View.GONE
                    }
            }
        }
    }


    /**
     * Deletes the image with URI [uri] and folder ID [folderId] from the 'my_collection' collection in Firestore.
     * @param uri: The URI of the image to delete.
     * @param folderId: The ID of the folder where the image is located.
     * @param folderName: The name of the folder where the image is located.
     */
    private fun deleteTheImage(uri: String?, folderId: String?, folderName: String?) {
        binding.progressBar.visibility = View.VISIBLE
        // Retrieving the reference of the 'my_collection' collection
        val collectionRef = firebaseFirestore.collection(folderId.toString())

        // Creating the query to retrieve the document to delete
        val query = collectionRef.whereEqualTo("pictureUri", uri)

        // Executing the query
        query.get().addOnSuccessListener { documents ->
            for (document in documents) {
                // Deleting the document
                document.reference.delete()
                    .addOnSuccessListener {
                        Log.d(TAG, "Image deleted")

                        // Retrieving the name of the file to delete from the URI
                        val filenameparse = uri?.substring(uri.lastIndexOf("/") + 1)
                        val filename: String = filenameparse!!.split("%2F")[1].split("?alt")[0]
                        // Creating the reference of the file to delete
                        val imageRef = storageRef.child(filename)

                        // Deleting the file in Firebase storage
                        imageRef.delete()
                            .addOnSuccessListener {
                                Log.d(TAG, "File deleted")
                                binding.progressBar.visibility = View.GONE
                                val intent = Intent(
                                    this@FullImagesActivity,
                                    ImagesFolderActivity::class.java
                                )
                                intent.putExtra("idFolder", folderId)
                                intent.putExtra("folderName", folderName)
                                startActivity(intent) // restarts the activity with the new Intent
                            }
                            .addOnFailureListener { e ->
                                Log.w(TAG, "Error while deleting the file", e)
                            }
                    }
                    .addOnFailureListener { e ->
                        binding.progressBar.visibility = View.GONE
                        Log.w(TAG, "Error while deleting the image", e)
                    }
            }
        }

    }


}