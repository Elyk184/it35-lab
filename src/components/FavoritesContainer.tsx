import React, { useState } from 'react';
import { IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonImg, IonText, IonIcon, IonButton } from '@ionic/react';
import { heart, heartOutline } from 'ionicons/icons';

const FavoritesContainer: React.FC = () => {
  const [favorites, setFavorites] = useState<{ title: string; img: string; liked: boolean }[]>([
    { title: 'Monkey D Luffy', img: 'https://i.pinimg.com/originals/ec/5f/37/ec5f377a267f9e999a5f4b13bd0fb102.gif', liked: false },
    
  ]);

  const toggleLike = (index: number) => {
    setFavorites(prev => prev.map((item, i) => (i === index ? { ...item, liked: !item.liked } : item)));
  };

  return (
    <IonContent className="ion-padding">
      <IonGrid>
        <IonRow>
          {favorites.map((item, index) => (
            <IonCol size="12" sizeMd="4" key={index}>
              <IonCard>
                <IonImg src={item.img} alt={item.title} />
                <IonCardContent>
                  <IonText>{item.title}</IonText>
                  <IonButton fill="clear" onClick={() => toggleLike(index)}>
                    <IonIcon icon={item.liked ? heart : heartOutline} color={item.liked ? 'danger' : 'medium'} />
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default FavoritesContainer;