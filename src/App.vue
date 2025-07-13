<script setup>
import Header from './components/Header.vue'
import FileUpload from './components/FileUpload.vue'
import OptionsForm from './components/OptionsForm.vue'
import ConvertButton from './components/ConvertButton.vue'
import GerberViewer from './components/GerberViewer.vue'
import ToastContainer from './components/ToastContainer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-grow grid place-items-center p-4">
      <div class="w-full max-w-xl space-y-6">
        <FileUpload />
        <OptionsForm />
        <GerberViewer />
        <ConvertButton />
      </div>
    </main>
    <ToastContainer />
  </div>
</template>
