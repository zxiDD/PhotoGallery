import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, FlatList, Dimensions, ActivityIndicator, Platform, TouchableOpacity, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const Home = () => {
    const [Photos, setPhotos] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [zoomedPhoto, setZoomedPhoto] = useState(null)

    const fetchPhotos = async () => {
        try {
            const cachedPhotos = await AsyncStorage.getItem('cachedPhotos');
            if (cachedPhotos) {
                setPhotos(JSON.parse(cachedPhotos))
            }

            const response = await axios.get('https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s')
            console.log(response.data)
            const newPhotos = response.data.photos.photo;
            setPhotos(newPhotos)

            await AsyncStorage.setItem('cachedPhotos', JSON.stringify(newPhotos))
        } catch (err) {
            console.error('Error fetching photos', err)
        } finally {
            setLoading(false)
        }
    }

    const onRefresh = async () => {
        setRefreshing(true)
        await fetchPhotos()
        setRefreshing(false)
    }

    const onPress = (photo) => {
        setZoomedPhoto(photo)
    }

    const closeModal = () => {
        setZoomedPhoto(null)
    }

    useEffect(() => {
        fetchPhotos()
    }, [])

    return (
        <View style={styles.container}>
            {loading ? (<ActivityIndicator size="large" color={"#457b9d"} />) :
                (<FlatList
                    numColumns={2}
                    data={Photos}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={()=>onPress(item)}>
                            <View style={{ margin: 10, overflow:"hidden", borderRadius:10, elevation:10}}>
                                <Image source={{ uri: item.url_s }} style={styles.image} />
                            </View>
                        </TouchableOpacity>
                    )}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />)}
                <Modal visible={!!zoomedPhoto} transparent={true} animationType="fade" onRequestClose={closeModal}>
                    <View style={styles.modalContainer}>
                        <Image source={{uri:zoomedPhoto?.url_s}} style={styles.zoomedImage}/>
                    </View>
                </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffff"
    },
    image: {
        width: (Dimensions.get('window').width / 2) - 20,
        height: 150,
    },
    modalContainer:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"rgba(0,0,0,0.8)"
    },
    zoomedImage:{
        width:(Dimensions.get('window').width-10),
        height:(Dimensions.get('window').height),
        resizeMode:"contain"
    },
    modalText:{
        color:"white",
        fontSize:10,
        fontWeight:"bold"
    }
})