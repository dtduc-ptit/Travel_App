import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/config';
import { formatDistanceToNow } from 'date-fns';
import Toast from 'react-native-toast-message';
import styles from '../style/timkiem.style';

const TimKiemBaiViet = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const router = useRouter();
  const { query } = useLocalSearchParams();

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query || (typeof query === 'string' && !query.trim())) {
        Toast.show({ type: 'info', text1: 'Vui lòng nhập từ khóa tìm kiếm' });
        return;
      }
  
      try {
        const response = await axios.get(`${API_BASE_URL}/api/baiviet/search`, {
          params: { keyword: query},
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error('Lỗi khi tìm kiếm bài viết:', error);
        Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Không thể tìm kiếm bài viết' });
      }
    };

    fetchSearchResults();
  }, [query]);

    
  const renderBaiViet = ({ item }: { item: any }) => {
    const postDate = new Date(item.thoiGian).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return (
      <TouchableOpacity style={styles.postItem} onPress={() => router.push({ pathname: '../screen/chitietbaiviet', params: { postId: item._id } })}>
        {item.hinhAnh ? (
          <Image source={{ uri: item.hinhAnh }} style={styles.postImage} />
        ) : (
          <View style={styles.placeholderImage} />
        )}
        <View style={styles.captionContainer}>
          <View style={styles.userInfo}>
            <Image
              source={
                item.nguoiDung?.anhDaiDien
                  ? { uri: item.nguoiDung.anhDaiDien }
                  : require('../../assets/images/logo.jpg')
              }
              style={styles.avatar}
            />
            <View>
              <Text style={styles.userName}>{item.nguoiDung?.ten}</Text>
              <Text style={styles.postDate}>{postDate}</Text>
            </View>
          </View>
          <Text style={styles.postContent} numberOfLines={2}>
            {item.noiDung}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Kết quả tìm kiếm: <Text style={styles.queryText}>"{query || ''}"</Text>
        </Text>
      </View>
      {searchResults.length === 0 && searchQuery ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không tìm thấy bài viết phù hợp</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderBaiViet}
          keyExtractor={(item) => item._id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={
            !searchQuery ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nhập từ khóa để tìm kiếm</Text>
              </View>
            ) : null
          }
        />
      )}
      <Toast />
    </SafeAreaView>
  );
};

export default TimKiemBaiViet;