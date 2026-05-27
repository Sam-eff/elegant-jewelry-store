import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { FaUser, FaEnvelope, FaUpload, FaSignOutAlt, FaCheckCircle } from 'react-icons/fa';
import { useAuthStore } from '../store/useAuthStore';
import axiosInstance from '../services/axiosInstance';
import { toast } from 'react-toastify';
import './Profile.css';

function Profile() {
    const { user, fetchUser, logout, loading } = useAuthStore();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            navigate('/login');
            return;
        }
        fetchUser();
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
            toast.warn('Please select and crop an image.');
            return;
        }

        setUploading(true);
        try {
            const croppedImageBlob = await getCroppedImg(preview, croppedAreaPixels);
            const formData = new FormData();
            formData.append('avatar', croppedImageBlob, 'avatar.jpg');

            await axiosInstance.put('upload-avatar/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Your avatar has been updated!');
            setFile(null);
            setPreview(null);
            
            // Re-fetch user in auth state to synchronize instantly across the application (e.g., Navbar)
            await fetchUser();

        } catch (err) {
            console.error(err);
            toast.error('Failed to upload profile photo.');
        } finally {
            setUploading(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.info('Logged out successfully.');
        navigate('/login');
    };

    if (loading && !user) {
        return (
            <div className="profile-loading">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading Profile...</span>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="profile-page section-padding">
            <div className="profile-page-container" data-aos="fade-up">
                <div className="section-title-wrapper">
                    <span className="section-subtitle">Private Lounge</span>
                    <h2 className="section-title">My Account</h2>
                </div>

                <div className="profile-dashboard-layout">
                    {/* Left Column: Profile Card */}
                    <div className="profile-info-column">
                        <div className="luxury-profile-card glass-card">
                            <div className="profile-avatar-wrapper">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt="User Avatar"
                                        className="luxury-profile-avatar"
                                        onError={(e) => { e.target.src = '/default-avatar.png'; }}
                                    />
                                ) : (
                                    <div className="luxury-profile-avatar-fallback">
                                        <FaUser />
                                    </div>
                                )}
                            </div>
                            
                            <h3 className="profile-display-name">{user.username}</h3>
                            <span className="profile-membership-tier">Connoisseur Member</span>

                            <div className="profile-divider"></div>

                            <div className="profile-details-list">
                                <div className="profile-detail-item">
                                    <FaUser className="detail-item-icon" />
                                    <div className="detail-item-meta">
                                        <span className="detail-label">Username</span>
                                        <span className="detail-val">{user.username}</span>
                                    </div>
                                </div>
                                <div className="profile-detail-item">
                                    <FaEnvelope className="detail-item-icon" />
                                    <div className="detail-item-meta">
                                        <span className="detail-label">Email Address</span>
                                        <span className="detail-val">{user.email}</span>
                                    </div>
                                </div>
                            </div>

                            <button className="btn-luxury logout-profile-btn w-100 mt-4" onClick={handleLogout}>
                                <FaSignOutAlt className="me-2" /> Logout Session
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Upload Avatar */}
                    <div className="profile-avatar-edit-column">
                        <div className="luxury-avatar-edit-card glass-card">
                            <h3 className="edit-card-title">Modify Profile Picture</h3>
                            <p className="edit-card-desc">Enhance your profile with a customized account image. Square dimensions work best.</p>
                            
                            <form onSubmit={handleAvatarUpload} className="avatar-upload-form">
                                <label htmlFor="avatarUpload" className="luxury-file-input-label">
                                    <FaUpload className="me-2" /> Choose Image File
                                </label>
                                <input
                                    type="file"
                                    id="avatarUpload"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden-file-input"
                                />

                                {file && <span className="selected-filename-tag">{file.name}</span>}

                                {preview && (
                                    <div className="cropper-outer-container">
                                        <span className="cropper-instruction">Drag to reposition / Scroll to zoom</span>
                                        <div className="cropper-container">
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
                                    </div>
                                )}

                                {preview && (
                                    <button 
                                        type="submit" 
                                        className="btn-luxury btn-luxury-solid w-100 mt-4"
                                        disabled={uploading}
                                    >
                                        <FaCheckCircle className="me-2" />
                                        {uploading ? 'Applying Edits...' : 'Save New Profile Picture'}
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
