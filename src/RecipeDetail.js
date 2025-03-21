import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import db from './db';

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]);

  useEffect(() => {
    async function loadRecipe() {
      const loadedRecipe = await db.recipes.get(Number(id));
      if (loadedRecipe) {
        setRecipe(loadedRecipe);
        setTitle(loadedRecipe.title);
        setText(loadedRecipe.text);
        setImages(loadedRecipe.images || []);
        setVideos(loadedRecipe.videos || []);
      }
    }
    loadRecipe();
  }, [id]);

  useEffect(() => {
    const newImageUrls = images.map(img => URL.createObjectURL(img));
    setImageUrls(newImageUrls);
    return () => {
      newImageUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [images]);

  useEffect(() => {
    const newVideoUrls = videos.map(vid => URL.createObjectURL(vid));
    setVideoUrls(newVideoUrls);
    return () => {
      newVideoUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [videos]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setImages(prev => [...prev, ...newFiles]);
  };

  const handleVideoChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setVideos(prev => [...prev, ...newFiles]);
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = (index) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const updatedRecipe = {
      ...recipe,
      title,
      text,
      images,
      videos
    };
    await db.recipes.put(updatedRecipe);
    alert('Recipe updated successfully!');
  };

  return (
    <div className="container">
      <h2>Edit Recipe</h2>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Recipe Text"
      />
      <h3>Images</h3>
      {images.map((image, index) => (
        <div key={index}>
          <img src={imageUrls[index]} alt={`Image ${index}`} style={{ width: '100px' }} />
          <button onClick={() => handleRemoveImage(index)}>Remove</button>
        </div>
      ))}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
      />
      <h3>Videos</h3>
      {videos.map((video, index) => (
        <div key={index}>
          <video src={videoUrls[index]} controls style={{ width: '100px' }} />
          <button onClick={() => handleRemoveVideo(index)}>Remove</button>
        </div>
      ))}
      <input
        type="file"
        multiple
        accept="video/*"
        onChange={handleVideoChange}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default RecipeDetail;