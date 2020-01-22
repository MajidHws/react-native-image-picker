import React, { useState } from 'react'
import {
	View, Text, Button, ScrollView,
	Image, TouchableWithoutFeedback, FlatList
} from 'react-native'
import CameraRoll from "@react-native-community/cameraroll"
import CameraRollPicker from 'react-native-camera-roll-picker';

const ImagePickerMulti = () => {

	const [photos, setPhotos] = useState([])
	const [selectedImages, setSelectedImages] = useState([])


	const _getImageFromCameraRoll = () => {

		CameraRoll.getPhotos({
			first: 20,
			assetType: 'Photos',
		})
			.then(r => {
				setPhotos(r.edges)
			})
			.catch(e => {
				alert('Error')
			})

	}

	const _saveToCameraRoll = () => {
		CameraRoll.save('https://picsum.photos/200/300')
			.then(photo => {
				_getImageFromCameraRoll()
			}).catch(e => {
				alert('Error')
			})
	}

	const _pickImage = (p) => {
		if (selectedImages.includes(p)) {
			return alert('Image Already Selected.')
		}
		setSelectedImages([...selectedImages, p])

	}

	const _renderItem = (uri) => {
		return (
			<TouchableWithoutFeedback onPress={() => _deleteSelectImage(uri)}>
				<Image
					style={{
						width: 100,
						height: 100,
					}}
					resizeMode="cover"
					source={{ uri: uri }}
				/>
			</TouchableWithoutFeedback>
		)
	}

	const _deleteSelectImage = (uri) => {
		const images = selectedImages.filter(image => image !== uri)
		setSelectedImages(images)
	}

	const _renderItemFromCameraRoll = (item) => {

		return (
			<TouchableWithoutFeedback onPress={() => _pickImage(item.node.image.uri)}>
				<Image
					style={{
						width: 100,
						height: 100,
					}}
					source={{ uri: item.node.image.uri }}
				/>
			</TouchableWithoutFeedback>
		)

	}

	return (
		<View style={{ flex: 1 }}>

			<Button title={'save image'.toUpperCase()} onPress={() => _saveToCameraRoll()} />
			<Button title={'get images'.toUpperCase()} onPress={() => _getImageFromCameraRoll()} />

			<View style={{ flex: 1 }}>

				{<Text>{selectedImages.length}</Text>}

				{
					<FlatList
						numColumns={4}
						keyExtractor={(item, i) => String(i)}
						data={selectedImages}
						renderItem={({ item }) => _renderItem(item)}
					/>
				}

				{
					<FlatList
						numColumns={4}
						keyExtractor={(item, i) => String(i)}
						data={photos}
						renderItem={({ item }) => _renderItemFromCameraRoll(item)}
					/>


				}

			</View>
		</View>
	)
}

export default ImagePickerMulti