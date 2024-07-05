package com.example.lapplimobilefabuleusedelaurentetsescopains.activity

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.lapplimobilefabuleusedelaurentetsescopains.databinding.EachItemBinding
import com.squareup.picasso.Picasso


class ImagesAdapter(private var mList:List<String>,
                    private val clickListener: (String) -> Unit) : RecyclerView.Adapter<ImagesAdapter.ImagesViewHolder>() {

    /**
     * We setting the click on image (itemView.setOnClickListener)
     * */
    inner class ImagesViewHolder(var binding : EachItemBinding, clickAtPosition: (Int) -> Unit) : RecyclerView.ViewHolder(binding.root){

        init {
            itemView.setOnClickListener {
                clickAtPosition(adapterPosition)
            }
        }
    }

    /**
     * We set the action to call and link it to the parameter
     * Objective, throw the logic in the activity and no surcharge in the item
     * More speed, Better, faster, stronger
     * */
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ImagesViewHolder {
        // The binding is the view of the parent -> Images Activity
        val binding = EachItemBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        // Each Image view component will be return insidde the view of the parents
        val vh = ImagesViewHolder(binding){
            clickListener(mList[it])
        }

        return vh
    }

    /**
     * Store the size of the element (number of element to saw)
     * */
    override fun getItemCount(): Int {
        return mList.size
    }

    /**
     * Set each element aspect on the android view
     * Picasso allowed us to load URI and show the image in ImagesViewHolder
     * */
    override fun onBindViewHolder(holder: ImagesViewHolder, position: Int) {
        with(holder.binding){
            // Implementation of Kotlin we loop because of getItemCount size
            with(mList[position]){

                val pictureList: List<String> = this.split(",")
                val pictureWithName: String =
                    pictureList.find { picture -> picture.contains("pictureName") }.toString()
                val pictureName: String = pictureWithName.split("=")[1].split("}")[0]
                holder.binding.textView.text = pictureName

                val pictureUriList: String =
                    pictureList.find { picture -> picture.contains("pictureUri") }.toString()
                val pictureUri: String = pictureUriList.split("Uri=")[1]

                // With picasso each image (URI PATH) is loaded and put inside the image view
                // After this
                // Each image view will be return in onCreateViewHolder to the view list Item of the parents
                Picasso.get().load(pictureUri).into(imageView)
            }
        }
    }

}