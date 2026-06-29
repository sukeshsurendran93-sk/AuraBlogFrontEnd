import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { calculateReadTime } from "../../utils/helpers";
import postsData from "../../data/posts.json";

const initialState = {
  posts: postsData.posts,
  filteredPosts: postsData.posts,
  searchQuery: "",
  selectedCategory: "All",
  currentPage: 1,
  bookmarkedPostIds: [],
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return postsData.posts;
});

const filterPosts = (posts, query, category, bookmarkedPostIds = []) => {
  let result = [...posts];

  if (category === "Bookmarked") {
    result = result.filter((p) => bookmarkedPostIds.includes(p.id));
  } else if (category && category !== "All") {
    result = result.filter((p) => p.category === category);
  }

  if (query) {
    const lower = query.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(lower) ||
        p.content.toLowerCase().includes(lower) ||
        p.tags.some((t) => t.toLowerCase().includes(lower)),
    );
  }

  return result;
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.filteredPosts = filterPosts(
        state.posts,
        action.payload,
        state.selectedCategory,
        state.bookmarkedPostIds,
      );
      state.currentPage = 1;
    },
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.filteredPosts = filterPosts(
        state.posts,
        state.searchQuery,
        action.payload,
        state.bookmarkedPostIds,
      );
      state.currentPage = 1;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setBookmarkedIds: (state, action) => {
      state.bookmarkedPostIds = action.payload;
      state.filteredPosts = filterPosts(
        state.posts,
        state.searchQuery,
        state.selectedCategory,
        action.payload,
      );
    },
    addPost: (state, action) => {
      const newPost = {
        ...action.payload,
        id: Date.now(),
        date: new Date().toISOString(),
        readTime: calculateReadTime(action.payload.content),
        likes: 0,
        comments: [],
      };
      state.posts.unshift(newPost);
      state.filteredPosts = filterPosts(
        state.posts,
        state.searchQuery,
        state.selectedCategory,
        state.bookmarkedPostIds,
      );
      state.currentPage = 1;
    },
    updatePost: (state, action) => {
      const { id, title, content, summary, category, tags, slug } = action.payload;
      const post = state.posts.find((p) => p.id === id);
      if (post) {
        post.title = title;
        post.content = content;
        post.summary = summary || title;
        post.category = category;
        post.tags = tags;
        post.readTime = calculateReadTime(content);
        if (slug) post.slug = slug;
      }
      state.filteredPosts = filterPosts(
        state.posts,
        state.searchQuery,
        state.selectedCategory,
        state.bookmarkedPostIds,
      );
    },
    toggleBookmark: (state, action) => {
      const postId = action.payload;
      const index = state.bookmarkedPostIds.indexOf(postId);
      if (index > -1) {
        state.bookmarkedPostIds.splice(index, 1);
      } else {
        state.bookmarkedPostIds.push(postId);
      }
      state.filteredPosts = filterPosts(
        state.posts,
        state.searchQuery,
        state.selectedCategory,
        state.bookmarkedPostIds,
      );
    },
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        if (!post.comments) post.comments = [];
        post.comments.push({
          id: Date.now(),
          ...comment,
          likes: 0,
          replies: [],
          date: "Just now",
        });
      }
      state.filteredPosts = filterPosts(
        state.posts,
        state.searchQuery,
        state.selectedCategory,
        state.bookmarkedPostIds,
      );
    },
    likePost: (state, action) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) post.likes += 1;
      state.filteredPosts = filterPosts(
        state.posts,
        state.searchQuery,
        state.selectedCategory,
        state.bookmarkedPostIds,
      );
    },
    likeComment: (state, action) => {
      const { postId, commentId } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post && post.comments) {
        const comment = post.comments.find((c) => c.id === commentId);
        if (comment) {
          comment.likes = (comment.likes || 0) + 1;
        }
      }
      state.filteredPosts = filterPosts(
        state.posts,
        state.searchQuery,
        state.selectedCategory,
        state.bookmarkedPostIds,
      );
    },
    addCommentReply: (state, action) => {
      const { postId, commentId, reply } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post && post.comments) {
        const comment = post.comments.find((c) => c.id === commentId);
        if (comment) {
          if (!comment.replies) comment.replies = [];
          comment.replies.push({
            id: Date.now(),
            ...reply,
            likes: 0,
            date: new Date().toISOString(),
          });
        }
      }
      state.filteredPosts = filterPosts(
        state.posts,
        state.searchQuery,
        state.selectedCategory,
        state.bookmarkedPostIds,
      );
    },
    likeCommentReply: (state, action) => {
      const { postId, commentId, replyId } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post && post.comments) {
        const comment = post.comments.find((c) => c.id === commentId);
        if (comment && comment.replies) {
          const reply = comment.replies.find((r) => r.id === replyId);
          if (reply) {
            reply.likes = (reply.likes || 0) + 1;
          }
        }
      }
      state.filteredPosts = filterPosts(
        state.posts,
        state.searchQuery,
        state.selectedCategory,
        state.bookmarkedPostIds,
      );
    },
  },
});

export const {
  setSearchQuery,
  setCategory,
  setPage,
  setBookmarkedIds,
  addPost,
  updatePost,
  toggleBookmark,
  addComment,
  likePost,
  likeComment,
  addCommentReply,
  likeCommentReply,
} = postsSlice.actions;
export default postsSlice.reducer;
