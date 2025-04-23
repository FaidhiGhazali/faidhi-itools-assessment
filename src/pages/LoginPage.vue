<template>
  <q-layout view="lHh LpR fFf">
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="q-pa-lg shadow-2" style="width: 350px">
          <q-card-section class="text-center">
            <q-avatar size="72px">
              <q-icon name="person" size="48px" />
            </q-avatar>
            <div class="text-h6 q-mt-sm">Login</div>
          </q-card-section>

          <!-- Login form section -->
          <q-card-section>
            <q-form @submit="onLogin" :disable="configStore.loading">
              <q-input
                v-model="username"
                label="Username"
                filled
                dense
                :rules="[val => !!val || 'Username is required']"
              />
              <q-input
                v-model="password"
                label="Password"
                type="password"
                filled
                dense
                class="q-mt-md"
                :rules="[val => !!val || 'Password is required']"
              />
              <q-btn
                type="submit"
                color="primary"
                label="Login"
                class="full-width q-mt-md"
                :loading="configStore.loading"
              />
            </q-form>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn flat label="Forgot Password?" @click="forgotPassword" />
          </q-card-actions>
        </q-card>
      </q-page>

      <!-- Error modal -->
      <q-dialog v-model="errorDialog">
        <q-card>
          <q-card-section class="text-center pb-0">
            <div class="text-h3">
              <q-icon name="warning" color="warning" />
            </div>
            <span>{{ errorMessage }}</span>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn flat label="Close" @click="errorDialog = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Forgot password modal -->
      <q-dialog v-model="forgotDialog">
        <q-card>
          <q-card-section class="text-center pb-0">
            <div class="text-h3">
              <q-icon name="info" color="primary" />
            </div>
            <span>{{ forgotMessage }}</span>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn flat label="Close" @click="forgotDialog = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </q-page-container>
  </q-layout>
</template>


<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useConfigStore } from "../stores/store";

const router = useRouter();
const username = ref("");
const password = ref("");
const errorMessage = ref("");
const errorDialog = ref(false);
const forgotDialog = ref(false);
const forgotMessage = ref("");
const configStore = useConfigStore(); // Accessing the Pinia store for authentication

// Function to handle login form submission
const onLogin = async () => {
  errorMessage.value = ""; // Clear previous error
  configStore.loading = true; // Set loading state

  // Call login method from store
  const result = await configStore.login(username.value, password.value);

  if (result.success) {
    router.replace("/"); // Redirect to home page if is successful
  } else {
     // Show error dialog with message
    errorMessage.value = result.message || "Login failed. Please check your credentials.";
    errorDialog.value = true;
  }

  configStore.loading = false; // Reset loading state
};

// Function to trigger forgot password dialog
const forgotPassword = () => {
  forgotMessage.value = "Reset password link sent!"
  forgotDialog.value = true
};
</script>

