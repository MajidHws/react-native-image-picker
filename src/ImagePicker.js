import React, { useState } from 'react'
import { View, Text, Button, ScrollView, Image } from 'react-native'
import CameraRoll from "@react-native-community/cameraroll"
import CameraRollPicker from 'react-native-camera-roll-picker';

const ImagePicker = () => {

	const [photos, setPhotos] = useState([])
	const [selectedImage, setSelectedImage] = useState(null)

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
		setSelectedImage(p)

	}

	return (
		<View style={{ flex: 1 }}>

			<Button title={'save image'.toUpperCase()} onPress={() => _saveToCameraRoll()} />
			<Button title={'get images'.toUpperCase()} onPress={() => _getImageFromCameraRoll()} />

			<ScrollView style={{ flex: 1 }}>
			{selectedImage ? (
				<Image
					style={{
						width: selectedImage.node.image.width,
						height: selectedImage.node.image.height,
					}}
					resizeMode="cover"
					source={{ uri: selectedImage.node.image.uri }}
				/>
			): (<Text>NO IMAGE SELECTED</Text>)}
				{
					photos.map((p, i) => {
						return (
							<>
								<Image
									key={i}
									style={{
										width: 'auto',
										height: 100,
									}}
									source={{ uri: p.node.image.uri }}
								/>
								<Button title={'Pick Image'.toUpperCase()} onPress={() => _pickImage(p)} />
								<Button onPress={async () => {
									await CameraRoll.deletePhotos([p.node.image.uri])
									_getImageFromCameraRoll()
								}} title={'DELETE'} />
							</>
						)
					})
				}
			</ScrollView>
		</View>
	)
}

export default ImagePicker