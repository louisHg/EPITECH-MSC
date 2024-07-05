import { StatusBar } from "react-native";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    data : {

        backgroundColor : 'silver',

    },
    dataTitle : {
        width: '100%',
        backgroundColor: 'orange',
        position: 'relative',
        margin: 10,
        color: 'black',
        fontWeight: 'bold',
        fontSize: 15,
    },
    dataThread : {
        position: 'relative',
        margin: 10,
        color: 'red',
        fontWeight: 'bold',
        fontSize: 15,
    },
    dataContent :  {
        color: 'blue',
        fontSize: 15,
    } ,
   container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#F5FCFF',
     borderWidth: 1,
     flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        borderWidth: 1,
        flexDirection: 'column',
   },
});  