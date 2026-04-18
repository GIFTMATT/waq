import * as ImageManipulator from 'expo-image-manipulator';

const CLOUD_NAME = 'dlbjuvumj';
const UPLOAD_PRESET = 'ongwediva_reports';

export const compressImage = async (uri) => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1200 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
};

export const uploadToCloudinary = async (imageUri) => {
  const compressedUri = await compressImage(imageUri);
  
  const formData = new FormData();
  formData.append('file', {
    uri: compressedUri,
    type: 'image/jpeg',
    name: `report_${Date.now()}.jpg`,
  });
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'ongwediva_reports');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  const data = await response.json();
  if (!data.secure_url) throw new Error('Upload failed');
  return data.secure_url;
};