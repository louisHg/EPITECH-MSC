package com.example.lapplimobilefabuleusedelaurentetsescopains.activity

import android.annotation.SuppressLint
import android.content.ContentValues
import android.content.ContentValues.TAG
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.MediaStore
import android.util.Log
import android.view.View
import android.widget.AdapterView
import android.widget.Spinner
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.lapplimobilefabuleusedelaurentetsescopains.R
import com.example.lapplimobilefabuleusedelaurentetsescopains.databinding.ActivityFolderImagesBinding
import com.example.lapplimobilefabuleusedelaurentetsescopains.kotlinClass.Image
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.storage.StorageReference
import java.io.File
import java.io.FileOutputStream
import java.time.LocalDate
import java.time.format.DateTimeFormatter

class ImagesFolderActivity : AppCompatActivity() {

    private lateinit var binding: ActivityFolderImagesBinding
    private lateinit var firebaseFirestore: FirebaseFirestore
    private var mList = mutableListOf<String>()
    private lateinit var adapter: ImagesAdapter
    private lateinit var storageRef: StorageReference
    private lateinit var folderId: String
    private var imageUri: Uri? = null
    private var nbColumn: Int = 2

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityFolderImagesBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val folderNameLayout: TextView = findViewById(R.id.folderName)
        val folderIdLayout: TextView = findViewById(R.id.idFolder)

        val bundle: Bundle? = intent.extras
        val idFolder = bundle!!.getString("idFolder")
        val folderName = bundle!!.getString("folderName")

        folderIdLayout.text = idFolder
        folderNameLayout.text = folderName

        if (idFolder != null) {
            initVars(idFolder, folderName.toString())
        }
        getImages()

        // All actions to handle activity main
        registerClickEvents()

        val spinner: Spinner = findViewById(binding.spinner.id)
        spinner.setSelection(1) // sélectionne l'élément à l'index 1 (2ème élément dans la liste)
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun registerClickEvents() {
        binding.addAnImages.setOnClickListener {
            addImage()
        }

        binding.imageView.setOnClickListener {
            resultLauncher.launch("image/*")
        }
        binding.logOut.setOnClickListener {
            FirebaseAuth.getInstance().signOut()
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
        }
        changeNbColomn()
    }

    private fun changeNbColomn() {
        binding.spinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(
                parent: AdapterView<*>,
                view: View?,
                position: Int,
                id: Long
            ) {
                val selectedNumber = parent.getItemAtPosition(position) as String
                nbColumn = selectedNumber.toInt()
                updateRecyclerView()
            }

            override fun onNothingSelected(parent: AdapterView<*>) {}
        }
    }

    private fun updateRecyclerView() {
        binding.recyclerView.layoutManager =
            GridLayoutManager(this, nbColumn, GridLayoutManager.VERTICAL, false)
        adapter.notifyDataSetChanged()
    }


    private val resultLauncher = registerForActivityResult(ActivityResultContracts.GetContent())
    {
        // We setting Image to upload after this
        imageUri = it
        binding.imageView.setImageURI(it)
    }

    private fun initVars(idFolder: String, folderName: String) {
        firebaseFirestore = FirebaseFirestore.getInstance()
        binding.recyclerView.setHasFixedSize(true)
        binding.recyclerView.layoutManager =
            GridLayoutManager(this, nbColumn, GridLayoutManager.VERTICAL, false)

        adapter = ImagesAdapter(mList) {
            showImage(it, idFolder, folderName)
        }
        binding.recyclerView.adapter = adapter
        folderId = binding.idFolder.text.toString()
        storageRef = FirebaseStorage.getInstance().reference.child(folderId)
    }

    /**
     * Displays an image in full screen from its URI.
     *
     * @param it the URI of the image to display
     * @param idFolder the id of the folder
     * @param folderName the folder name
     */
    private fun showImage(it: String, idFolder: String, folderName: String) {
        // Displays a progress bar to indicate the loading of the image
        binding.progressBar.visibility = View.VISIBLE
        // Create a new intention to open the FullImagesActivity
        val intent = Intent(this@ImagesFolderActivity, FullImagesActivity::class.java)
        // Adds the URI of the image to the intention in order to display it in full screen

        val pictureList: List<String> = it.split(",")
        val pictureWithName: String =
            pictureList.find { picture -> picture.contains("pictureName") }.toString()
        val pictureName: String = pictureWithName.split("=")[1].split("}")[0]

        val pictureUriList: String =
            pictureList.find { picture -> picture.contains("pictureUri") }.toString()
        val pictureUri: String = pictureUriList.split("Uri=")[1]

        val pictureWithDate: String =
            pictureList.find { picture -> picture.contains("pictureDate") }.toString()
        val pictureDate: String = pictureWithDate.split("pictureDate=")[1]

        val pictureDescription: String = pictureList[0].split("{pictureDescription=")[1]

        intent.putExtra("uriParam", pictureUri)
        intent.putExtra("idFolder", idFolder)
        intent.putExtra("folderName", folderName)
        intent.putExtra("pictureName", pictureName)
        intent.putExtra("pictureDate", pictureDate)
        intent.putExtra("pictureDescription", pictureDescription)
        //Hides the progress bar once the image is loaded
        binding.progressBar.visibility = View.GONE
        //Launch the FullImagesActivity to display the image
        startActivity(intent)
    }

    /**
     * This method retrieves images from Firestore for the current folder and updates the UI
     * */
    @SuppressLint("NotifyDataSetChanged")
    private fun getImages() {
        binding.progressBar.visibility = View.VISIBLE
        firebaseFirestore.collection(folderId)
            .get().addOnSuccessListener {
                for (i in it) {
                    mList.add(i.data.toString())
                }
                adapter.notifyDataSetChanged()
                binding.progressBar.visibility = View.GONE
            }
    }

    /**
     * Add a new image to the folder and upload it to Firebase Storage and Firestore.
     * The image is compressed to reduce its size before being uploaded.
     * If the image URI is null, the function will stop and the progress bar will be hidden.
     * If the quality of the image is not specified, it will be set to 50.
     * After the image is uploaded, a new Image object is created and added to the Firestore database.
     */
    @RequiresApi(Build.VERSION_CODES.O)
    private fun addImage() {
        // Create a reference to a new image file in Firebase Storage
        storageRef = storageRef.child(System.currentTimeMillis().toString())
        if (imageUri == null) {
            // If the image URI is null, stop the function and hide the progress bar
            binding.progressBar.visibility = View.GONE
        }
        var quality: Int
        if (binding.imageQuality.text.toString().isEmpty()) {
            // If the image quality is not specified, set it to 50
            quality = 50
        } else {
            quality = binding.imageQuality.text.toString().toInt()
        }
        // Get the name of the image from the UI
        val imageName: String = binding.imageName.text.toString()
        imageUri?.let {
            // Compress the image before uploading it to Firebase Storage
            val compressedImageFile = File(cacheDir, "compressedImage.jpg")
            val outputStream = FileOutputStream(compressedImageFile)
            val bitmap = MediaStore.Images.Media.getBitmap(contentResolver, imageUri)
            bitmap.compress(Bitmap.CompressFormat.JPEG, quality, outputStream)
            outputStream.flush()
            outputStream.close()
            storageRef.putFile(Uri.fromFile(compressedImageFile)).addOnCompleteListener { task ->
                if (task.isSuccessful) {

                    // Get the download URL of the image from Firebase Storage
                    storageRef.downloadUrl.addOnSuccessListener { uri ->

                        // Create a new Image object and add it to the Firestore database
                        val currentDate = LocalDate.now()
                        val formattedDate =
                            DateTimeFormatter.ofPattern("dd/MM/yyyy").format(currentDate)
                        val image = Image(imageName, uri.toString(), formattedDate.toString(), "")

                        // Add the new Image object to the Firestore database
                        firebaseFirestore.collection(folderId).add(image)
                            .addOnCompleteListener { firestoreTask ->

                                if (firestoreTask.isSuccessful) {
                                    Log.d(TAG, "Uploaded Successfully")
                                } else {
                                    Log.w(TAG, "Error uploaded images")
                                }
                                // Hide the progress bar and reset the image view
                                binding.progressBar.visibility = View.GONE
                                binding.imageView.setImageResource(R.drawable.vector)
                                // Refresh the activity
                                finish()
                                startActivity(intent)
                            }
                    }
                } else {
                    Log.w(TAG, "Error storage Ref put image")
                    // Hide the progress bar and reset the image view
                    binding.progressBar.visibility = View.GONE
                    binding.imageView.setImageResource(R.drawable.vector)
                }
            }
        }
    }
}