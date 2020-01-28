import React, { useState, useEffect } from 'react'
import {
	View, Text, Button, ScrollView, TextInput,
	Image, TouchableWithoutFeedback, FlatList,
	Dimensions
} from 'react-native'
import CameraRoll from "@react-native-community/cameraroll"
import CameraRollPicker from 'react-native-camera-roll-picker';

const DownloadImages = () => {

	useEffect(() => {
		_getImageFromCameraRoll()
	}, [])
	const [photos, setPhotos] = useState([])
	const [selectedImages, setSelectedImages] = useState([])
	const [link, setLink] = useState(null)
	const imagesPerRow = 2

	const _handleLinkInput = (text) => {
		setLink(text)
	}

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
		if (!link) { return alert('MUST ADD A LINK') }
		CameraRoll.save(link)
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

		const { width, height } = Dimensions.get('screen')
		const imgWidth = width / imagesPerRow
		return (
			<TouchableWithoutFeedback onPress={() => _deleteSelectImage(uri)}>
				<Image
					style={{
						width: imgWidth,
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
		const { width, height } = Dimensions.get('screen')
		const imgWidth = width / imagesPerRow
		return (
			<TouchableWithoutFeedback onPress={() => _pickImage(item.node.image.uri)}>
				<Image
					style={{
						width: imgWidth,
						height: 300,
					}}
					source={{ uri: item.node.image.uri }}
				/>
			</TouchableWithoutFeedback>
		)

	}

	return (
		<View style={{ flex: 1 }}>

			<View style={{
				backgroundColor: '#eee'

			}}>

				<TextInput
					value={link}
					onChangeText={(text) => _handleLinkInput(text)}
					style={{
						height: 50,
						padding: 15,
						backgroundColor: '#fff',
						margin: 10,
						borderRadius: 20,
					}}
					placeholder={'PASTE IMAGE LINK HERE ...'}
				/>

				<View style={{
					flexDirection: 'row',
					justifyContent: 'space-around',

				}}>
					<Button title={'save image'.toUpperCase()} onPress={() => _saveToCameraRoll()} />
					<Button title={'get images'.toUpperCase()} onPress={() => _getImageFromCameraRoll()} />
				</View>
				{<Text>{`SELECTED IMAGES: ${selectedImages.length}`}</Text>}
			</View>

			<View style={{ flex: 1 }}>



				{
					<FlatList
						numColumns={imagesPerRow}
						keyExtractor={(item, i) => String(i)}
						data={selectedImages}
						renderItem={({ item }) => _renderItem(item)}
					/>
				}

				{
					<FlatList

						numColumns={imagesPerRow}
						keyExtractor={(item, i) => String(i)}
						data={photos}
						renderItem={({ item }) => _renderItemFromCameraRoll(item)}
					/>


				}

			</View>
		</View>
	)
}

export default DownloadImages