package com.example.lapplimobilefabuleusedelaurentetsescopains.activity

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import com.example.lapplimobilefabuleusedelaurentetsescopains.databinding.ActivityLoginBinding
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import java.nio.charset.StandardCharsets
import java.util.*

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private lateinit var firebaseFirestore: FirebaseFirestore
    private lateinit var auth: FirebaseAuth
    private val emailPattern = "[a-zA-Z0-9._-]+@[a-z]+\\.+[a-z]+"

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityLoginBinding.inflate(layoutInflater)
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
        binding.goToRegister.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }
        binding.login.setOnClickListener {
            binding.progressBar.visibility = View.VISIBLE
            chezIfEmpty()
            login()
        }
    }

    /**
     * Encode password More secure
     * */
    @RequiresApi(Build.VERSION_CODES.O)
    private fun encodeString(stringToEncode: String): String {
        val encodedBytes = Base64.getEncoder().encode(stringToEncode.toByteArray(StandardCharsets.UTF_8))
        return String(encodedBytes, StandardCharsets.UTF_8)
    }

    /**
     * Check if the input is empty and check other things
     * */
    private fun chezIfEmpty() {
        val login: String = binding.email.text.toString()
        val password: String = binding.password.text.toString()

        if (login.isEmpty()){
            Toast.makeText(this, "Please enter your login", Toast.LENGTH_SHORT).show()
            binding.progressBar.visibility = View.INVISIBLE
        }
        if (password.isEmpty()){
            Toast.makeText(this, "Please enter your password", Toast.LENGTH_SHORT).show()
            binding.progressBar.visibility = View.INVISIBLE
        }
        if (password.length < 6){
            Toast.makeText(this, "Please enter a password with more than 6 characters", Toast.LENGTH_SHORT).show()
            binding.progressBar.visibility = View.INVISIBLE
        }
        if (!login.matches(emailPattern.toRegex())){
            Toast.makeText(this, "Please enter a valid email", Toast.LENGTH_SHORT).show()
            binding.progressBar.visibility = View.INVISIBLE
        }
    }


    /**
     *
     * Handle the login, call auth by google and log in
     * auth.signInWithEmailAndPassword allowed us to started a session handle by google
     * Plus he handle the secuity (connexion between plurals device, login at certain moment)
     *
     * */
    @RequiresApi(Build.VERSION_CODES.O)
    private fun login() {
        val login: String = binding.email.text.toString()
        val password: String = binding.password.text.toString()
        val encodePassword = encodeString(password)
        auth.signInWithEmailAndPassword(login, encodePassword).addOnCompleteListener {
            if (it.isSuccessful){
                Toast.makeText(this, "Welcome", Toast.LENGTH_SHORT).show()
                val intent = Intent(this, HomeActivity::class.java)
                startActivity(intent)
                binding.progressBar.visibility = View.INVISIBLE
            }
            else{
                Toast.makeText(this, "Something went wrong, try again", Toast.LENGTH_SHORT).show()
            }
        }

    }

}