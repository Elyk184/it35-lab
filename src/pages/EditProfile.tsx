import React, { useState, useRef, useEffect } from 'react';
import {
  IonContent, IonPage, IonInput, IonButton, IonAlert, IonHeader,
  IonBackButton, IonButtons, IonItem, IonText, IonCol, IonGrid,
  IonRow, IonInputPasswordToggle, IonImg, IonAvatar,
  IonToolbar,
  IonTitle,
} from '@ionic/react';
import { supabase } from '../utils/supabaseClient';
import { useHistory } from 'react-router-dom';

const EditProfile: React.FC = () => {
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const history = useHistory();
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    useEffect(() => {
        const fetchSessionAndData = async () => {
          // Fetch the current session
          const { data: session, error: sessionError } = await supabase.auth.getSession();
      
          if (sessionError || !session || !session.session) {
            setAlertMessage('You must be logged in to access this page.');
            setShowAlert(true);
            history.push('/it35-lab/login'); // Redirect to login if no session is found
            return;
          }
      
          // Fetch user details from Supabase using the session's email
          const { data: user, error: userError } = await supabase
            .from('users')
            .select('user_firstname, user_lastname, user_avatar_url, user_email, username')
            .eq('user_email', session.session.user.email) // Use email from the session
            .single();
      
          if (userError || !user) {
            setAlertMessage('User data not found.');
            setShowAlert(true);
            return;
          }
      
          // Populate form fields with the retrieved data
          setFirstName(user.user_firstname || '');
          setLastName(user.user_lastname || '');
          setAvatarPreview(user.user_avatar_url);
          setEmail(user.user_email);
          setUsername(user.username || '');
        };
      
        fetchSessionAndData();
      }, [history]);
  
    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
      }
    };
  
    const handleUpdate = async () => {
        if (password !== confirmPassword) {
          setAlertMessage("Passwords don't match.");
          setShowAlert(true);
          return;
        }
      
        // Fetch the current session
        const { data: session, error: sessionError } = await supabase.auth.getSession();
      
        if (sessionError || !session || !session.session) {
          setAlertMessage('Error fetching session or no session available.');
          setShowAlert(true);
          return;
        }
      
        const user = session.session.user;
      
        if (!user.email) {
            setAlertMessage('Error: User email is missing.');
            setShowAlert(true);
            return;
          }
          
          const { error: passwordError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: currentPassword,
          });
          
      
        if (passwordError) {
          setAlertMessage('Incorrect current password.');
          setShowAlert(true);
          return;
        }
      
        // Handle avatar upload if the avatar file is changed
        let avatarUrl = avatarPreview;
      
        if (avatarFile) {
            const fileExt = avatarFile.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;
          
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('user-avatars')
              .upload(filePath, avatarFile, {
                cacheControl: '3600',
                upsert: true,  // Allows overwriting existing files
              });
          
            if (uploadError) {
              setAlertMessage(`Avatar upload failed: ${uploadError.message}`);
              setShowAlert(true);
              return;
            }
          
            // Retrieve the public URL
            const { data } = supabase.storage.from('user-avatars').getPublicUrl(filePath);
            avatarUrl = data.publicUrl;
          }
          
      
        // Update user data in the users table
        const { error: updateError } = await supabase
          .from('users')
          .update({
            user_firstname: firstName,
            user_lastname: lastName,
            user_avatar_url: avatarUrl,
            username: username,
          })
          .eq('user_email', user.email);
      
        if (updateError) {
          setAlertMessage(updateError.message);
          setShowAlert(true);
          return;
        }
      
        // Update the password if a new password is provided
        if (password) {
          const { error: passwordUpdateError } = await supabase.auth.updateUser({
            password: password,
          });
      
          if (passwordUpdateError) {
            setAlertMessage(passwordUpdateError.message);
            setShowAlert(true);
            return;
          }
        }
      
        setAlertMessage('Account updated successfully!');
        setShowAlert(true);
        history.push('/it35-lab/app');
      };
      
  
      return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonBackButton  defaultHref="/it35-lab/app" />
              </IonButtons>
              <IonTitle>Edit Profile</IonTitle>
            </IonToolbar>
          </IonHeader>
    
          <IonContent className="ion-padding">
            <IonGrid>
              <IonRow className="ion-justify-content-center">
                <IonCol className="ion-text-center" size="12">
                  {avatarPreview && (
                    <IonAvatar style={{ width: '120px', height: '120px', margin: '0 auto' }}>
                      <IonImg src={avatarPreview} style={{ objectFit: 'cover' }} />
                    </IonAvatar>
                  )}
                  <IonButton
                    expand="block"
                    color="success"
                    onClick={() => fileInputRef.current?.click()}
                    shape="round"
                    size="small"
                    style={{ marginTop: '10px' }}
                  >
                    Change Avatar
                  </IonButton>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </IonCol>
              </IonRow>
    
              {/* Username */}
              <IonRow>
                <IonCol>
                  <IonInput
                    label="Username"
                    type="text"
                    labelPlacement="floating"
                    fill="outline"
                    color="success"
                    shape="round"
                    placeholder="Enter username"
                    value={username}
                    onIonChange={(e) => setUsername(e.detail.value!)}
                  />
                </IonCol>
              </IonRow>
    
              {/* First and Last Name */}
              <IonRow>
                <IonCol size="6">
                  <IonInput
                    label="First Name"
                    color="success"
                    type="text"
                    labelPlacement="floating"
                    fill="outline"
                    shape="round"
                    placeholder="Enter first name"
                    value={firstName}
                    onIonChange={(e) => setFirstName(e.detail.value!)}
                  />
                </IonCol>
                <IonCol size="6">
                  <IonInput
                    label="Last Name"
                    type="text"
                    color="success"
                    labelPlacement="floating"
                    fill="outline"
                    shape="round"
                    placeholder="Enter last name"
                    value={lastName}
                    onIonChange={(e) => setLastName(e.detail.value!)}
                  />
                </IonCol>
              </IonRow>
    
              {/* Section Header */}
              <IonRow>
                <IonCol>
                  <IonText color="medium">
                    <h3 style={{ marginTop: '30px' }}>Change Password</h3>
                  </IonText>
                </IonCol>
              </IonRow>
    
              {/* New Password */}
              <IonRow>
                <IonCol>
                  <IonInput
                    label="New Password"
                    type="password"
                    color="success"
                    labelPlacement="floating"
                    fill="outline"
                    shape="round"
                    placeholder="Enter new password"
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value!)}
                  >
                    <IonInputPasswordToggle slot="end" />
                  </IonInput>
                </IonCol>
              </IonRow>
    
              {/* Confirm Password */}
              <IonRow>
                <IonCol>
                  <IonInput
                    label="Confirm Password"
                    type="password"
                    color="success"
                    labelPlacement="floating"
                    fill="outline"
                    shape="round"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                  >
                    <IonInputPasswordToggle slot="end" />
                  </IonInput>
                </IonCol>
              </IonRow>
    
              {/* Section Header */}
              <IonRow>
                <IonCol>
                  <IonText color="medium">
                    <h3 style={{ marginTop: '30px' }}>Confirm Changes</h3>
                  </IonText>
                </IonCol>
              </IonRow>
    
              {/* Current Password */}
              <IonRow>
                <IonCol>
                  <IonInput
                    label="Current Password"
                    type="password"
                    color="success"
                    labelPlacement="floating"
                    fill="outline"
                    shape="round"
                    placeholder="Enter current password to confirm changes"
                    value={currentPassword}
                    onIonChange={(e) => setCurrentPassword(e.detail.value!)}
                  >
                    <IonInputPasswordToggle slot="end" />
                  </IonInput>
                </IonCol>
              </IonRow>
    
              {/* Submit Button */}
              <IonRow className="ion-padding-vertical">
                <IonCol>
                  <IonButton expand="block" onClick={handleUpdate} shape="round" color="success">
                    Save Changes
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
    
            {/* Alert */}
            <IonAlert
              isOpen={showAlert}
              onDidDismiss={() => setShowAlert(false)}
              message={alertMessage}
              buttons={['OK']}
            />
          </IonContent>
        </IonPage>
      );
    };
    
    export default EditProfile;