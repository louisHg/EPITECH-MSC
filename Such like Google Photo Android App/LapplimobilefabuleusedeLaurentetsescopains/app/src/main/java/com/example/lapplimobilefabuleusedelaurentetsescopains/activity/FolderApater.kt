package com.example.lapplimobilefabuleusedelaurentetsescopains.activity

import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.example.lapplimobilefabuleusedelaurentetsescopains.databinding.EachFolderBinding
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore

class FolderApater(
    private val mList: List<String>,
    private val clickListener: (String) -> Unit,
    private val buttonClickListener: (String) -> Unit
) : RecyclerView.Adapter<FolderApater.FolderViewHolder>() {

    private lateinit var auth: FirebaseAuth

    /**
     * Define the action, first click on button, second on the button
     * */
    class FolderViewHolder(
        var binding: EachFolderBinding,
        clickAtPosition: (Int) -> Unit,
        clickToUpdate: (Int) -> Unit
    ) : RecyclerView.ViewHolder(binding.root) {
        init {
            binding.buttonUpdate.setOnClickListener {
                clickToUpdate(adapterPosition)
            }
            itemView.setOnClickListener {
                clickAtPosition(adapterPosition)
            }
        }
    }

    /** the paramters in the first parameters is to go into the folder and the second
     * To go into modifier (click on the button) */
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): FolderViewHolder {
        val binding = EachFolderBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        val vh = FolderViewHolder(binding,
            {
                // It is the position of the recycler view declare below (constructor method)
                // And we invoking the click in the parent view (HomeActivity)
                // It's better to invoke here, we do not invoke in the onBindViewHolder
                // Because it's a bad practices to blend th shower functions and the onClickFunction
                clickListener(mList[it])
            },
            {
                buttonClickListener(mList[it])
            })

        return vh

    }

    /**
     * List the size of item and number to show on recycler view
     * */
    override fun getItemCount(): Int {
        return mList.size
    }

    /**
     * Called to show the folder, folder name + button if owner of the folder
     * We loop on and we set it the informations
     * */
    override fun onBindViewHolder(holder: FolderViewHolder, position: Int) {
        with(holder.binding) {
            with(mList[position]) {
                val folderList: List<String> = this.split(",")
                val folderWithName: String =
                    folderList.find { folder -> folder.contains("folderName") }.toString()
                val folderName: String = folderWithName.split("=")[1].split("}")[0]
                holder.binding.textView.text = folderName

                val folderWithIdOwner: String =
                    folderList.find { folder -> folder.contains("folderOwner") }.toString()
                val idOwner: String = folderWithIdOwner.split("=")[1].split("}")[0]

                auth = FirebaseAuth.getInstance()
                if(idOwner != auth.currentUser!!.uid){
                    holder.binding.buttonUpdate.visibility =  View.GONE
                }
            }
        }
    }
}