package com.example.lapplimobilefabuleusedelaurentetsescopains.activity

import android.content.ContentValues.TAG
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import com.example.lapplimobilefabuleusedelaurentetsescopains.databinding.ActivityRegisterBinding
import com.example.lapplimobilefabuleusedelaurentetsescopains.kotlinClass.User
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import java.nio.charset.StandardCharsets
import java.util.*

class RegisterActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRegisterBinding
    private lateinit var firebaseFirestore: FirebaseFirestore
    private lateinit var auth: FirebaseAuth
    private val emailPattern = "[a-zA-Z0-9._-]+@[a-z]+\\.+[a-z]+"

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        initVars()
        registerClickEvents()
    }

    private fun initVars() {
        firebaseFirestore = FirebaseFirestore.getInstance()
        auth = FirebaseAuth.getInstance()
    }

    /**
     *
     * Register Click event
     * */
    @RequiresApi(Build.VERSION_CODES.O)
    private fun registerClickEvents() {
        binding.goToLogin.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
        }
        binding.register.setOnClickListener {
            binding.progressBar.visibility = View.VISIBLE
            chezIfEmpty()
            register()
        }
    }

    /**
     * Encode password More secure
     * */
    @RequiresApi(Build.VERSION_CODES.O)
    fun encodeString(stringToEncode: String): String {
        val encodedBytes = Base64.getEncoder().encode(stringToEncode.toByteArray(StandardCharsets.UTF_8))
        return String(encodedBytes, StandardCharsets.UTF_8)
    }

    /**
     * Check if the input is empty and check other things
     * */
    private fun chezIfEmpty() {
        val login: String = binding.email.text.toString()
        val password: String = binding.password.text.toString()
        val passwordChecker: String = binding.passwordChecker.text.toString()

        if (login.isEmpty()){
            Toast.makeText(this, "Please enter your login", Toast.LENGTH_SHORT).show()
            binding.progressBar.visibility = View.INVISIBLE
        }
        if (password.isEmpty()){
            Toast.makeText(this, "Please enter your password", Toast.LENGTH_SHORT).show()
            binding.progressBar.visibility = View.INVISIBLE
        }
        if (passwordChecker.isEmpty()){
            Toast.makeText(this, "Please enter the second password", Toast.LENGTH_SHORT).show()
            binding.progressBar.visibility = View.INVISIBLE
        }
        else if (password.length < 6){
            Toast.makeText(this, "Please enter a password with more than 6 characters", Toast.LENGTH_SHORT).show()
            binding.progressBar.visibility = View.INVISIBLE
        }
        else if (!login.matches(emailPattern.toRegex())){
            Toast.makeText(this, "Please enter a valid email", Toast.LENGTH_SHORT).show()
            binding.progressBar.visibility = View.INVISIBLE
        }

    }

    /**
     * Allowed us to register, we store the informations + create session usable in the future
     * */
    @RequiresApi(Build.VERSION_CODES.O)
    private fun register() {
        val login: String = binding.email.text.toString()
        val password: String = binding.password.text.toString()
        val passwordChecker: String = binding.passwordChecker.text.toString()

        if(password == passwordChecker){
            val encodePassword = encodeString(password)
            auth.createUserWithEmailAndPassword(login, encodePassword)
                .addOnCompleteListener {
                    if(it.isSuccessful){
                        val user = User(auth.currentUser!!.uid, login, encodePassword)
                        firebaseFirestore
                            .collection("users")
                            .add(user)
                            .addOnCompleteListener { firestoreTask ->
                                if (firestoreTask.isSuccessful){
                                    Log.d(TAG, "Registered Successfully")
                                    Toast.makeText(this, "Registered Successfully", Toast.LENGTH_SHORT).show()
                                    binding.progressBar.visibility = View.INVISIBLE
                                    binding.email.text.clear()
                                    binding.password.text.clear()
                                    binding.passwordChecker.text.clear()
                                    startActivity(Intent(this, LoginActivity::class.java))
                                }
                                else{
                                    Log.w(TAG, "Registered failed")
                                }
                            }
                    }
                    else{
                        Log.w(TAG, "Something went wrong, try again")
                    }
                }

        }
        else{
            Toast.makeText(this, "Please enter correctly the passwords", Toast.LENGTH_SHORT).show()
        }

    }

}