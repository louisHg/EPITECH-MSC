package com.example.lapplimobilefabuleusedelaurentetsescopains.activity

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import com.example.lapplimobilefabuleusedelaurentetsescopains.R
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.storage.StorageReference
import com.example.lapplimobilefabuleusedelaurentetsescopains.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    // Kamel case use to the binding
    private lateinit var binding: ActivityMainBinding
    private lateinit var storageRef: StorageReference
    private lateinit var firebaseFirestore: FirebaseFirestore
    private var imageUri: Uri? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Initialize activity_main layout
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Initialiaz db firebase
        initVars()

        // All actions to handle activity main
        registerClickEvents()
    }

    private fun registerClickEvents() {
        binding.uploadBtn.setOnClickListener {
            uploadImage()
        }

        binding.showAllBtn.setOnClickListener {
            // Action to invoc ImagesActivity class when we click on show all btn
            startActivity(Intent(this, ImagesActivity::class.java))
        }

        binding.imageView.setOnClickListener {
            resultLauncher.launch("image/*")
        }
    }

    private val resultLauncher = registerForActivityResult( ActivityResultContracts.GetContent())
    {
        // We setting Image to upload after this
        imageUri = it
        binding.imageView.setImageURI(it)
    }

    private fun initVars() {

        // On vient se fixer sur le folder Images dans storage
        storageRef = FirebaseStorage.getInstance().reference.child("Images")
        firebaseFirestore = FirebaseFirestore.getInstance()
        firebaseFirestore.clearPersistence();
    }


    private fun uploadImage() {
        // BIG RECAP
        // Firebase DB is composed of 2 db (1 db and 1 storage)
        // The storage which is appeared as a ressources storage like a folder in our desktop
        // And the Firestore Database is the db which link the ressources saved and the data as URI
        binding.progressBar.visibility = View.VISIBLE
        storageRef = storageRef.child(System.currentTimeMillis().toString())
        imageUri?.let {
            // We put image previously select as URI in the section ("Images") in firebase store
            storageRef.putFile(it).addOnCompleteListener { task ->
                if (task.isSuccessful) {

                    // downloadUrl allow us to send the image
                    storageRef.downloadUrl.addOnSuccessListener { uri ->

                        // We setting this in firebaseStore as pic object with the URI as the location (URL of the storage)
                        // Example -> pic : https://firebasestorage.googleapis.com/v0/b/laurentetsescopains-1299d.appspot.com/o
                        // /Images%2F1678039199763?alt=media&token=128c19b1-9fd9-4268-8862-2cd8e408f3b1
                        val map = HashMap<String, Any>()
                        map["pic"] = uri.toString()

                        // We add this to firebase store
                        firebaseFirestore.collection("images").add(map).addOnCompleteListener { firestoreTask ->

                            if (firestoreTask.isSuccessful){
                                Toast.makeText(this, "Uploaded Successfully", Toast.LENGTH_SHORT).show()

                            }
                            else{
                                Toast.makeText(this, firestoreTask.exception?.message, Toast.LENGTH_SHORT).show()

                            }
                            binding.progressBar.visibility = View.GONE
                            binding.imageView.setImageResource(R.drawable.vector)

                        }
                    }
                } else {
                    Toast.makeText(this, task.exception?.message, Toast.LENGTH_SHORT).show()
                    binding.progressBar.visibility = View.GONE
                    binding.imageView.setImageResource(R.drawable.vector)
                }
            }
        }
    }

}