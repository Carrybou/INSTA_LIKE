<template>
                            <div class="post-view">
                              <label for="description" class="form-label text-light">Nouveau Post</label>
                              <button v-if="!imagePreview" @click="openFileDialog" class="btn btn-primary btn-lg btn-block mb-3">+</button>
                              <input type="file" ref="fileInput" class="d-none" @change="onFileChange">
                              <div v-if="imagePreview" class="image-preview mb-3">
                                <img :src="imagePreview" alt="Image Preview" class="img-fluid mx-auto d-block">
                              </div>
                              <div class="mb-3">
                                <textarea class="form-control description-field" id="description" v-model="post.content" placeholder="Description"></textarea>
                              </div>
                              <div class="mb-3">
                                <label for="tags" class="form-label text-light">Tags</label>
                                <input type="text" class="form-control bg-dark text-light border-secondary" id="tags" v-model="tagInput" @keyup.enter="addTag">
                                <div class="d-flex flex-wrap mt-2">
                                  <span v-for="(tag, index) in post.tags" :key="index" class="badge bg-secondary me-2">
                                    {{ tag.name }} <i class="fas fa-times ms-1" @click="removeTag(index)"></i>
                                  </span>
                                </div>
                              </div>
                              <div class="d-flex justify-content-between">
                                <button @click="submitPost" class="btn btn-light mt-3">Publier</button>
                                <button @click="cancelPost" class="btn btn-secondary mt-3">Annuler</button>
                              </div>
                            </div>
                          </template>

                          <script setup>
                          import { ref } from 'vue';
                          import { useRouter } from 'vue-router';
                          import api from '../services/api';

                          const post = ref({
                            title: '',
                            img: '',
                            content: '',
                            tags: [],
                          });

                          const file = ref(null);
                          const imagePreview = ref(null);
                          const tagInput = ref('');
                          const fileInput = ref(null);
                          const router = useRouter();

                          const openFileDialog = () => {
                            fileInput.value.click();
                          };

                          const onFileChange = (e) => {
                            file.value = e.target.files[0];
                            if (file.value) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                imagePreview.value = event.target.result;
                              };
                              reader.readAsDataURL(file.value);
                            }
                          };

                          const addTag = () => {
                            if (tagInput.value.trim() !== '') {
                              post.value.tags.push({ name: `#${tagInput.value.trim()}`, color: '#ffffff', uuid: '' });
                              tagInput.value = '';
                            }
                          };

                          const removeTag = (index) => {
                            post.value.tags.splice(index, 1);
                          };

                          const submitPost = async () => {
                            if (file.value) {
                              try {
                                const uploadResponse = await api.uploadFile(file.value);
                                post.value.img = uploadResponse.data.path;
                              } catch (error) {
                                console.error('Error uploading file:', error);
                                return;
                              }
                            }

                            post.value.title = post.value.content.substring(0, 10);

                            try {
                              await api.createContent(post.value);
                              alert('Post created successfully');
                              router.push({ name: 'Home' });
                            } catch (error) {
                              console.error('Error creating post:', error);
                            }
                          };

                          const cancelPost = () => {
                            router.push({ name: 'Home' });
                          };
                          </script>

                          <style scoped>
                          .post-view {
                            background-color: #1c1c1c;
                            padding: 20px;
                            border-radius: 8px;
                          }

                          .form-label {
                            font-weight: bold;
                          }

                          .description-field {
                            background-color: #1c1c1c;
                            color: #fff;
                            border: none;
                            border-radius: 0;
                          }

                          .badge {
                            cursor: pointer;
                          }

                          .btn-light {
                            background-color: #333;
                            color: #fff;
                            border-color: #333;
                          }

                          .btn-light:hover {
                            background-color: #444;
                            border-color: #444;
                          }

                          .btn-secondary {
                            background-color: #555;
                            color: #fff;
                            border-color: #555;
                          }

                          .btn-secondary:hover {
                            background-color: #666;
                            border-color: #666;
                          }

                          .image-preview img {
                            max-width: 100%;
                            height: auto;
                          }
                          </style>
