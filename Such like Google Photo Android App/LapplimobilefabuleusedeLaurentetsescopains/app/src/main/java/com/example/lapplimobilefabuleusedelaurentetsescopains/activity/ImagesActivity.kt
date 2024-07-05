package com.example.lapplimobilefabuleusedelaurentetsescopains.activity

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.lapplimobilefabuleusedelaurentetsescopains.databinding.ActivityImagesBinding
import com.google.firebase.firestore.FirebaseFirestore

class ImagesActivity : AppCompatActivity() {

    private lateinit var binding: ActivityImagesBinding
    private lateinit var firebaseFirestore: FirebaseFirestore
    private var mList = mutableListOf<String>()
    private lateinit var adapter: ImagesAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityImagesBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Initialization of the firebase db link
        initVars()
        getImages()
    }

    private fun initVars() {
        firebaseFirestore = FirebaseFirestore.getInstance()
        binding.recyclerView.setHasFixedSize(true)
        binding.recyclerView.layoutManager = LinearLayoutManager(this)
        // We list mList (List of a string) with adapter the objet of the class ImagesAdapter
        //adapter = ImagesAdapter(mList)
        // We put the images item in the list of the recycler view
        //binding.recyclerView.adapter = adapter
    }

    @SuppressLint("NotifyDataSetChanged")
    private fun getImages(){
        // We launch progress bar
        binding.progressBar.visibility = View.VISIBLE
        // We search each item of the collection "images"
        firebaseFirestore.collection("images")
            .get().addOnSuccessListener {
                // For each item of the firebase db we put the uri string value
                // In the db each images is store as a map with prefix pic + URI (STRING FORMAT)
                for(i in it){
                    mList.add(i.data["pictureUri"].toString())
                }
                // Launch class adapter
                adapter.notifyDataSetChanged()
                // At the end of the process we erase progress bar
                binding.progressBar.visibility = View.GONE
            }
    }

}