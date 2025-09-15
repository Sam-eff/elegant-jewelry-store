import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import './Profile.css';

function Profile() {
    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState('');
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const navigate = useNavigate();

    const fetchUser = async (accessToken) => {
        try {
            const response = await axios.get('http://localhost:8000/api/me/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            setUser(response.data);
        } catch (err) {
            console.error('Failed to fetch user info', err);
            navigate('/login');
        }
    };

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            navigate('/login');
            return;
        }


        fetchUser(accessToken);
    }, [navigate]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // 🔥 Helper function directly inside Profile.jsx
    const getCroppedImg = (imageSrc, pixelCrop) => {
        const canvas = document.createElement('canvas');
        const image = new Image();
        image.src = imageSrc;

        return new Promise((resolve, reject) => {
            image.onload = function () {
                canvas.width = pixelCrop.width;
                canvas.height = pixelCrop.height;
                const ctx = canvas.getContext('2d');

                ctx.drawImage(
                    image,
                    pixelCrop.x,
                    pixelCrop.y,
                    pixelCrop.width,
                    pixelCrop.height,
                    0,
                    0,
                    pixelCrop.width,
                    pixelCrop.height
                );

                canvas.toBlob((blob) => {
                    if (!blob) {
                        console.error('Canvas is empty');
                        return;
                    }
                    blob.name = 'avatar.jpg';
                    resolve(blob);
                }, 'image/jpeg');
            };
            image.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleAvatarUpload = async (e) => {
        e.preventDefault();
        if (!file || !croppedAreaPixels) {
            setMessage('Please select and crop an image.');
            return;
        }

        try {
            const croppedImageBlob = await getCroppedImg(preview, croppedAreaPixels);

            const formData = new FormData();
            formData.append('avatar', croppedImageBlob, 'avatar.jpg');

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

            // RE-FETCH to update the avatar immediately:
            fetchUser(accessToken); 

            setPreview(null); // Clear crop preview

        } catch (err) {
            console.error(err);
            setMessage('Failed to upload avatar.');  
        }
    };

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="profile-container">
            <h2>My Profile</h2>

            <div className="avatar-section">
                {user.avatar ? (
                    <img
                        src={user.avatar}
                        alt="avatar"
                        className="profile-avatar"
                        style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = '/default-avatar.png'; }}
                    />
                ) : (
                    <div className="no-avatar">No avatar uploaded</div>
                )}
            </div>

            <div className="profile-info">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>

            <div className="avatar-form">
                <label htmlFor="avatarUpload" className="form-label">
                    Upload & Crop New Avatar:
                </label>
                <input
                    type="file"
                    id="avatarUpload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="form-input"
                />

                {preview && (
                    <div className="crop-container" style={{ position: 'relative', width: 300, height: 300, marginTop: '1rem' }}>
                        <Cropper
                            image={preview}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>
                )}

                {preview && (
                    <button onClick={handleAvatarUpload} className="upload-button">
                        Save Avatar
                    </button>
                )}
            </div>

            <button 
                className="logout-btn" 
                onClick={() => {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user');
                    navigate('/login');
                }}
            >
                Logout
            </button>

            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default Profile;





        



