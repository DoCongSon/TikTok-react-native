import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import IconButton from '../../components/button/IconButton';
import Divider from '../../components/other/Divider';
import { useUser } from '../../hooks/useUser';
import { postsListenerByUserId } from '../../services/posts';
import ProfilePostItem from '../other/ProfilePostItem';
import ProfileHeader from '../../components/other/ProfileHeader';

const ProfileScreen = ({ route }) => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const postList = useSelector((state) => state.post.currentUserPosts);
  const profileUserIdDisplay = useSelector((state) => state.profile.profileUserIdDisplay);
  const [user, setUser] = useState(currentUser);
  const [posts, setPosts] = useState(postList);
  const isCurrentUser = route.params.isCurrentUser;
  const userDisplay = useUser(profileUserIdDisplay).data;

  useEffect(() => {
    let isMounted = true;
    let unsub = null;
    if (!isCurrentUser && userDisplay) {
      setUser(userDisplay);
      const fetchPosts = async () => {
        const unsub = await postsListenerByUserId(profileUserIdDisplay, (posts) => {
          if (isMounted) {
            setPosts(posts);
          }
        });
        return unsub;
      };
      unsub = fetchPosts();
    }

    return () => {
      isMounted = false;
      if (unsub) {
        unsub.then((unsubscribe) => unsubscribe());
      }
    };
  }, [isCurrentUser, userDisplay]);

  return (
    <View style={styles.container}>
      <View style={styles.navBarContainer}>
        <IconButton icon='search' size={24} color='black' />
        <Text style={styles.displayName}>{user.displayName}</Text>
        <IconButton icon='menu' size={24} color='black' />
      </View>
      <Divider color='gray' size={1} horizontal={20} vertical={10} />
      <ProfileHeader user={user} />
      <Divider color='gray' size={1} />
      <View style={styles.postsContainer}>
        <FlatList
          numColumns={3}
          removeClippedSubviews
          data={posts}
          keyExtractor={(post) => post.id}
          renderItem={({ item }) => <ProfilePostItem item={item} />}
        />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  navBarContainer: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  displayName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postsContainer: {
    flex: 1,
  },
});
