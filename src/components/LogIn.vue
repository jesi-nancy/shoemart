<template>
  <div class="login-container">
    <div class="form">
      <h1>shoe <span>carnival</span></h1>
      <h2>Login</h2>

      <form @submit.prevent="handleLogin" class="input">
        <div class="inputBox">
          <label>Username</label>
          <input type="text" v-model="username" required />
        </div>
        <div class="inputBox">
          <label>Password</label>
          <input type="password" v-model="password" required />
        </div>
        <div class="inputBox">
          <div class="btn-container" style="width: 50%; margin-left: 25%; margin-top: 10%;">
            <input type="submit" value="Sign In" class="signin-btn mx-auto d-block" />
          </div>
        </div>
      </form>

      <p class="forgot">
        Forgot Password? <a href="#" @click.prevent="handleForgotPassword">Click Here</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogIn',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    handleLogin() {
      if (this.username.trim() && this.password.trim()) {
        this.$store.commit('setUsername', this.username)
        this.$store.commit('setAuth', true)
        this.$router.push('/home')
      } else {
        alert('Please enter both username and password.')
      }
    },
    handleForgotPassword() {
      alert('Password reset functionality would go here')
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Oswald&display=swap');
@import url('https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Oswald', sans-serif;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #060c21;
}

.form {
  position: relative;
  background: #060c21;
  border: 1px solid #ffffff;
  width: 350px;
  padding: 40px 40px 60px;
  border-radius: 10px;
  text-align: center;
}

.form::before {
  content: '';
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  background: linear-gradient(315deg,#e91e63,#5d02ff);
  z-index: -1;
  transform: skew(2deg,1deg);
  border-radius: 10px;
}

.form h2, h1 {
  color: #fff;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 5px;
  margin-bottom: 20px;
}

span {
  color: #e91e63;
  font-weight: 700;
}

.form h2 {
  font-size: 1.4em;
}

.input {
  margin-top: 40px;
  text-align: left;
}

.inputBox {
  margin-top: 10px;
}

.inputBox label {
  display: block;
  color: #fff;
  margin-bottom: 5px;
  font-size: 18px;
  letter-spacing: 1px;
}

.inputBox input {
  width: 100%;
  height: 40px;
  border: none;
  outline: none;
  padding: 5px 15px;
  background: linear-gradient(315deg,#e91e63,#5d02ff);
  color: #fff;
  font-size: 18px;
  border-radius: 10px;
}

.inputBox input[type="submit"] {
  cursor: pointer;
  margin-top: 20px;
  letter-spacing: 1px;
}

.inputBox input[type="submit"]:hover {
  background: linear-gradient(315deg,#5d02ff,#e91e63);
}

.inputBox input[type="submit"]:active {
  color: rgba(255, 255, 255, 0.521);
  background: linear-gradient(315deg,#e91e6271,#5f02ff8c);
}

.forgot {
  margin-top: 10px;
  color: #fff;
  font-size: 14px;
  letter-spacing: 1px;
}

.forgot a {
  color: #ff0800;
  text-decoration: none;
}

.forgot a:hover {
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .form {
    width: 90%;
    padding: 30px 30px 50px;
  }

  .form h2 {
    font-size: 1.5em;
    letter-spacing: 3px;
  }

  .inputBox input {
    font-size: 16px;
  }
}
</style>
