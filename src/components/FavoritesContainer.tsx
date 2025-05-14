import React, { useState } from 'react';
import { IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonImg, IonText, IonIcon, IonButton } from '@ionic/react';
import { heart, heartOutline } from 'ionicons/icons';

const FavoritesContainer: React.FC = () => {
  const [favorites, setFavorites] = useState<{ title: string; img: string; liked: boolean }[]>([
    { title: 'Relaxing Beach', img: 'https://www.gifcen.com/wp-content/uploads/2021/03/passover-gif-5.gif', liked: false },
    { title: 'Cozy Fireplace', img: 'https://i.makeagif.com/media/1-07-2019/RSqEi_.gif', liked: false },
    { title: 'Mountain Adventure', img: 'https://i.pinimg.com/originals/75/98/71/759871bc3cd242ae9c0bfd1fd058bdb0.gif', liked: false }
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