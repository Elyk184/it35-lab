import { 
  IonAvatar,
  IonButton,
  IonButtons,
    IonContent, 
    IonHeader, 
    IonIcon, 
    IonInput, 
    IonInputPasswordToggle, 
    IonItem, 
    IonList, 
    IonMenuButton, 
    IonPage, 
    IonTitle, 
    IonToolbar, 
    useIonRouter
} from '@ionic/react';
import { logoIonic } from 'ionicons/icons';

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const doLogin = () => {
      navigation.push('/it35-lab/app','forward','replace');
  }
  return (
        
    <IonPage>
      
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonList>
      <IonAvatar>
        
         <IonIcon icon={logoIonic} size="large" color="primary"></IonIcon>
      </IonAvatar>
      <IonItem>
        <IonInput label="Username" placeholder="Kyle"></IonInput>
      </IonItem>
      <IonItem><IonInput type="password" label="Password" value="NeverGonnaGiveYouUp">
      <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
    </IonInput></IonItem>
      

      <IonItem>
        <IonInput label="Email" type="email" placeholder="sample@domain.com"></IonInput>
      </IonItem>
    </IonList>
      <IonContent className='ion-padding'>
      <IonButton onClick={() => doLogin()} expand="full">
          Login    
          </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;