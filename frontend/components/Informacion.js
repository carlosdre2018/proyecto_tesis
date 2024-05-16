import React, {useState, useEffect, useRef} from 'react'
import {StyleSheet, View, Text, Button, FlatList, Touchable} from 'react-native';
import {Card, FAB} from 'react-native-paper';
import ActionSheet from 'react-native-actions-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';

function Informacion({route}) {
    let url = "https://6801-2800-4b0-5301-47c8-a829-a1ae-94bd-6276.ngrok-free.app"
    let nidio = null;
    const actionSheetRef = useRef(null)
    const [data, setData] = useState([])
    const {label} = route.params;


    useEffect(() => {
        console.log('antes del fetch::')

        fetch(url + `/get?recid=${label}`, {
            method: 'GET'
        })
        .then(resp => resp.json())
        .then(article => {
            setData(article)
        })
        .catch(function (error) {
            console.log("Hubo un problema con la petición Fetch:" + error.message);
        });

    }, [])

    const cambiarIdioma = () => {
        fetch(url+"/idioma", {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({nidio: nidio, datos: data})
        })
        .then(resp => resp.json())
        .then(recurso => {
            console.log('esto trae:', recurso.data)
            setData(recurso.data)
        })
        .catch(error => console.log('recurso:',recurso,'error:',error))
    }

    const renderData = (item) => {
        return (
            <Card style= {styles.cardStyle} >
                <Text>{item.recid}</Text>
                <Text>{item.recurso}</Text>
                <Text>{item.desc}</Text>
            </Card>
        )
    }
 
    return (
        <View style = {{flex:1}}>
            <FlatList 
                data = {data}
                renderItem = {({item}) => {
                    return renderData(item)
                }}
                keyExtractor={ item => `${item.id}`}
            />

            <FAB 
            style= {styles.fab}
            small={false}
            icon="flag"
            theme = {{colors: {accent: "green"}}}
            onPress = {() => {
                actionSheetRef.current?.show()
            }}
            //onPress = {() => cambiarIdioma()}
            />
            <ActionSheet ref = {actionSheetRef}>
                    <TouchableOpacity 
                        onPress={() => {
                            nidio = "en"
                            actionSheetRef.current?.hide();
                            cambiarIdioma()
                        }}
                        style={{
                            height:100,
                            width:"90%",
                            backgroundColor:'#fff',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <Text>Ingles</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => {
                            nidio = "ja"
                            actionSheetRef.current?.hide();
                            cambiarIdioma()
                        }}
                        style={{
                            height:100,
                            width:"90%",
                            backgroundColor:'#fff',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <Text>Japones</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => {
                            nidio = "ca"
                            actionSheetRef.current?.hide();
                            cambiarIdioma()
                        }}
                        style={{
                            height:100,
                            width:"90%",
                            backgroundColor:'#fff',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <Text>Catalan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => {
                            nidio = "ko"
                            actionSheetRef.current?.hide();
                            cambiarIdioma()
                        }}
                        style={{
                            height:100,
                            width:"90%",
                            backgroundColor:'#fff',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <Text>Catalan</Text>
                    </TouchableOpacity>
            </ActionSheet>
        </View>
    )
}

const styles = StyleSheet.create({
  cardStyle: {
    margin: 10,
    padding: 10
  },

  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0
  }
})

export default Informacion;