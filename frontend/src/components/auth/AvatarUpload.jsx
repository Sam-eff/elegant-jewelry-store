
import axios from 'axios';
import getCroppedImg from './cropImageHelper'; // helper we'll make


const AvatarUpload = async (e) => {
    e.preventDefault();
    if (!file || !croppedAreaPixels) {
        setMessage('Please select and crop an image.');
        return;
    }

    try {
        const croppedImage = await getCroppedImg(preview, croppedAreaPixels);

        const formData = new FormData();
        formData.append('avatar', croppedImage, 'avatar.jpg');

        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.put('http://localhost:8000/api/upload-avatar/', formData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        setUser(prev => ({ ...prev, avatar: response.data.avatar }));

        const localUser = JSON.parse(localStorage.getItem('user'));
        localUser.avatar = response.data.avatar;
        localStorage.setItem('user', JSON.stringify(localUser));

        window.dispatchEvent(new Event('storage'));

        setMessage('Avatar updated successfully!');
        setFile(null);
        setPreview(null); // Clear crop preview
    } catch (err) {
        console.error(err);
        setMessage('Failed to upload avatar.');
    }
};

export default AvatarUpload;