import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import ImageCropPicker from 'react-native-image-crop-picker';
import Slider from '@react-native-community/slider';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

type FilterType = 'none' | 'grayscale' | 'sepia' | 'brightness' | 'contrast';

const CameraScreen = () => {
  const navigation = useNavigation();
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('none');
  const [filterIntensity, setFilterIntensity] = useState(1);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const frontDevice = useCameraDevice('front');
  const currentDevice = isFrontCamera ? frontDevice : device;

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const takePhoto = async () => {
    if (camera.current) {
      try {
        setIsProcessing(true);
        const photo = await camera.current.takePhoto({
          qualityPrioritization: 'quality',
          enableAutoStabilization: true,
        });
        setCapturedPhoto(`file://${photo.path}`);
      } catch (error) {
        Alert.alert('Error', 'Failed to take photo');
        console.error(error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setSelectedFilter('none');
    setFilterIntensity(1);
  };

  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  const editPhoto = async () => {
    if (!capturedPhoto) return;

    try {
      const croppedImage = await ImageCropPicker.openCropper({
        path: capturedPhoto,
        width: 800,
        height: 800,
        cropping: true,
        freeStyleCropEnabled: true,
        includeBase64: false,
      });

      setCapturedPhoto(croppedImage.path);
      Alert.alert('Success', 'Photo edited successfully!');
    } catch (error) {
      console.log('User cancelled crop or error:', error);
    }
  };

  const savePhoto = async () => {
    if (!capturedPhoto) return;

    try {
      setIsProcessing(true);
      const timestamp = Date.now();
      const filename = `filtered_photo_${timestamp}.jpg`;
      const destPath = `${RNFS.PicturesDirectoryPath}/${filename}`;

      await RNFS.copyFile(capturedPhoto.replace('file://', ''), destPath);

      Alert.alert(
        'Success',
        `Photo saved to gallery!\n${filename}`,
        [{ text: 'OK', onPress: retakePhoto }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save photo');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyFilter = (filter: FilterType) => {
    setSelectedFilter(filter);
  };

  const getFilterStyle = () => {
    const baseStyle: any = {};

    switch (selectedFilter) {
      case 'grayscale':
        return {
          tintColor: `rgba(128, 128, 128, ${filterIntensity})`,
        };
      case 'sepia':
        return {
          tintColor: `rgba(112, 66, 20, ${filterIntensity * 0.5})`,
        };
      case 'brightness':
        return {
          opacity: 0.5 + filterIntensity * 0.5,
        };
      case 'contrast':
        return {
          opacity: filterIntensity,
        };
      default:
        return {};
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Camera permission required</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentDevice) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.permissionText}>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Camera with Filters</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Camera or Preview */}
      <View style={styles.cameraContainer}>
        {capturedPhoto ? (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: capturedPhoto }}
              style={[styles.preview, getFilterStyle()]}
              resizeMode="contain"
            />
            {selectedFilter !== 'none' && (
              <View style={styles.filterOverlay} />
            )}
          </View>
        ) : (
          <Camera
            ref={camera}
            style={styles.camera}
            device={currentDevice}
            isActive={true}
            photo={true}
          />
        )}
      </View>

      {/* Filter Controls */}
      {capturedPhoto && (
        <View style={styles.filterControls}>
          <Text style={styles.filterLabel}>
            Filter: {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}
          </Text>
          <View style={styles.filterButtons}>
            {(['none', 'grayscale', 'sepia', 'brightness', 'contrast'] as FilterType[]).map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && styles.filterButtonActive,
                ]}
                onPress={() => applyFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedFilter === filter && styles.filterButtonTextActive,
                  ]}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Intensity Slider */}
          {selectedFilter !== 'none' && (
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Intensity: {Math.round(filterIntensity * 100)}%</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={filterIntensity}
                onValueChange={setFilterIntensity}
                minimumTrackTintColor="#007AFF"
                maximumTrackTintColor="#ddd"
                thumbTintColor="#007AFF"
              />
            </View>
          )}
        </View>
      )}

      {/* Controls */}
      <View style={styles.controls}>
        {capturedPhoto ? (
          <View style={styles.previewControls}>
            <TouchableOpacity style={styles.controlButton} onPress={retakePhoto}>
              <Text style={styles.controlButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={editPhoto}>
              <Text style={styles.controlButtonText}>Crop/Rotate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, styles.saveButton]}
              onPress={savePhoto}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[styles.controlButtonText, styles.saveButtonText]}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.captureControls}>
            <TouchableOpacity style={styles.toggleButton} onPress={toggleCamera}>
              <Text style={styles.toggleButtonText}>🔄</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePhoto}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>
            <View style={styles.placeholder} />
          </View>
        )}
      </View>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: width,
    height: height - 400,
  },
  filterOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  filterControls: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  filterLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 3,
    marginVertical: 3,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    fontWeight: 'bold',
  },
  sliderContainer: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  sliderLabel: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 5,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  controls: {
    paddingBottom: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  captureControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
  },
  toggleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 24,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  controlButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 100,
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    fontWeight: 'bold',
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});