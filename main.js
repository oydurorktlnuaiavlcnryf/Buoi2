// ========================================
// Quản Lý Posts & Comments
// Trần Biện Minh Tâm - 2280614642
// ========================================

const API_URL = 'http://localhost:3000';

// Lưu data để filter/sort
let allPosts = [];
let allComments = [];

// Biến theo dõi đang edit
let editingPostId = null;
let editingCommentId = null;

// ========================================
// POSTS - LOAD
// ========================================
async function LoadPosts() {
    try {
        let res = await fetch(API_URL + '/posts');
        let data = await res.json();
        allPosts = data;
        renderPostTable(allPosts);
    } catch (error) {
        console.error("Lỗi khi tải posts:", error);
        document.getElementById("table-body").innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-danger py-4">
                    <i class="bi bi-exclamation-triangle" style="font-size: 2rem;"></i>
                    <p class="mt-2">Không thể kết nối server!<br>
                    <small>Hãy chạy: <code>npx json-server db.json</code></small></p>
                </td>
            </tr>`;
    }
}

// ========================================
// POSTS - RENDER TABLE
// ========================================
function renderPostTable(data) {
    let body = document.getElementById("table-body");
    let countBadge = document.getElementById("count_badge");

    let activePosts = data.filter(p => !p.isDeleted);
    countBadge.textContent = activePosts.length + " posts (+" + (data.length - activePosts.length) + " đã xóa)";

    if (data.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">
                    <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                    <p class="mt-2">Không tìm thấy kết quả</p>
                </td>
            </tr>`;
        return;
    }

    body.innerHTML = "";
    for (const post of data) {
        let rowClass = post.isDeleted ? 'deleted-row' : '';
        let statusBadge = post.isDeleted
            ? '<span class="badge bg-danger">Đã xóa</span>'
            : '<span class="badge bg-success">Hoạt động</span>';

        let actionBtns = '';
        if (post.isDeleted) {
            actionBtns = `
                <button class="btn btn-sm btn-success" onclick="RestorePost('${post.id}')">
                    <i class="bi bi-arrow-counterclockwise"></i> Khôi phục
                </button>`;
        } else {
            actionBtns = `
                <button class="btn btn-sm btn-warning me-1" onclick="EditPost('${post.id}')">
                    <i class="bi bi-pencil"></i> Sửa
                </button>
                <button class="btn btn-sm btn-danger" onclick="SoftDeletePost('${post.id}')">
                    <i class="bi bi-trash"></i> Xóa
                </button>`;
        }

        body.innerHTML += `
            <tr class="${rowClass}">
                <td><span class="badge bg-secondary">${post.id}</span></td>
                <td>${post.title}</td>
                <td><span class="badge bg-info text-dark">${post.views}</span></td>
                <td>${statusBadge}</td>
                <td>${actionBtns}</td>
            </tr>`;
    }
}

// ========================================
// POSTS - SEARCH (onChanged)
// ========================================
function onChanged() {
    let keyword = document.getElementById("search_input").value.toLowerCase().trim();
    let filtered = allPosts.filter(function (post) {
        return post.title.toLowerCase().includes(keyword);
    });
    renderPostTable(filtered);
}

// ========================================
// POSTS - SORT
// ========================================
function sortBy(field, order) {
    let keyword = document.getElementById("search_input").value.toLowerCase().trim();
    let data = allPosts.filter(function (post) {
        return post.title.toLowerCase().includes(keyword);
    });

    data.sort(function (a, b) {
        if (field === 'title') {
            let valA = a.title.toLowerCase();
            let valB = b.title.toLowerCase();
            return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else if (field === 'views') {
            let valA = parseInt(a.views) || 0;
            let valB = parseInt(b.views) || 0;
            return order === 'asc' ? valA - valB : valB - valA;
        }
    });

    renderPostTable(data);
}

// ========================================
// POSTS - Tính maxId + 1 (ID tự tăng)
// ========================================
function getNextPostId() {
    let maxId = 0;
    for (const post of allPosts) {
        let num = parseInt(post.id) || 0;
        if (num > maxId) {
            maxId = num;
        }
    }
    return String(maxId + 1);
}

// ========================================
// POSTS - SAVE (Thêm mới / Sửa)
// ========================================
async function SavePost() {
    let title = document.getElementById("title_txt").value.trim();
    let views = document.getElementById("views_txt").value.trim();

    if (!title || !views) {
        alert("Vui lòng điền đầy đủ Title và Views!");
        return;
    }

    let res;

    if (editingPostId) {
        // UPDATE (PUT) - giữ nguyên isDeleted nếu có
        let existingPost = allPosts.find(p => p.id === editingPostId);
        let body = { title: title, views: views };
        if (existingPost && existingPost.isDeleted) {
            body.isDeleted = existingPost.isDeleted;
        }

        res = await fetch(API_URL + '/posts/' + editingPostId, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
    } else {
        // CREATE (POST) - ID tự tăng
        let newId = getNextPostId();
        res = await fetch(API_URL + '/posts', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: newId, title: title, views: views })
        });
    }

    if (res.ok) {
        alert(editingPostId ? "Sửa thành công!" : "Thêm thành công!");
        CancelEditPost();
        LoadPosts();
    } else {
        alert("Lỗi khi lưu!");
    }
}

// ========================================
// POSTS - EDIT (điền vào form)
// ========================================
function EditPost(id) {
    let post = allPosts.find(p => p.id === id);
    if (!post) return;

    editingPostId = id;
    document.getElementById("id_txt").value = id;
    document.getElementById("title_txt").value = post.title;
    document.getElementById("views_txt").value = post.views;
}

// ========================================
// POSTS - HỦY EDIT
// ========================================
function CancelEditPost() {
    editingPostId = null;
    document.getElementById("id_txt").value = "";
    document.getElementById("title_txt").value = "";
    document.getElementById("views_txt").value = "";
}

// ========================================
// POSTS - XÓA MỀM (isDeleted: true)
// ========================================
async function SoftDeletePost(id) {
    if (!confirm("Bạn có chắc muốn xóa post #" + id + "?")) return;

    let post = allPosts.find(p => p.id === id);
    if (!post) return;

    let res = await fetch(API_URL + '/posts/' + id, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: true })
    });

    if (res.ok) {
        alert("Đã xóa mềm post #" + id);
        LoadPosts();
    } else {
        alert("Lỗi khi xóa!");
    }
}

// ========================================
// POSTS - KHÔI PHỤC (isDeleted: false)
// ========================================
async function RestorePost(id) {
    let res = await fetch(API_URL + '/posts/' + id, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: false })
    });

    if (res.ok) {
        alert("Đã khôi phục post #" + id);
        LoadPosts();
    } else {
        alert("Lỗi khi khôi phục!");
    }
}

// ========================================
// COMMENTS - LOAD
// ========================================
async function LoadComments() {
    try {
        let res = await fetch(API_URL + '/comments');
        let data = await res.json();
        allComments = data;
        renderCommentTable(allComments);
    } catch (error) {
        console.error("Lỗi khi tải comments:", error);
    }
}

// ========================================
// COMMENTS - RENDER TABLE
// ========================================
function renderCommentTable(data) {
    let body = document.getElementById("comment-table-body");
    let countBadge = document.getElementById("comment_count_badge");

    countBadge.textContent = data.length + " comments";

    if (data.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted py-4">
                    <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                    <p class="mt-2">Chưa có comment nào</p>
                </td>
            </tr>`;
        return;
    }

    body.innerHTML = "";
    for (const comment of data) {
        body.innerHTML += `
            <tr>
                <td><span class="badge bg-secondary">${comment.id}</span></td>
                <td>${comment.text}</td>
                <td><span class="badge bg-primary">${comment.postId}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="EditComment('${comment.id}')">
                        <i class="bi bi-pencil"></i> Sửa
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="DeleteComment('${comment.id}')">
                        <i class="bi bi-trash"></i> Xóa
                    </button>
                </td>
            </tr>`;
    }
}

// ========================================
// COMMENTS - Tính maxId + 1
// ========================================
function getNextCommentId() {
    let maxId = 0;
    for (const comment of allComments) {
        let num = parseInt(comment.id) || 0;
        if (num > maxId) {
            maxId = num;
        }
    }
    return String(maxId + 1);
}

// ========================================
// COMMENTS - SAVE (Thêm mới / Sửa)
// ========================================
async function SaveComment() {
    let text = document.getElementById("comment_text_txt").value.trim();
    let postId = document.getElementById("comment_postid_txt").value.trim();

    if (!text || !postId) {
        alert("Vui lòng điền đầy đủ Text và Post ID!");
        return;
    }

    let res;

    if (editingCommentId) {
        // UPDATE (PUT)
        res = await fetch(API_URL + '/comments/' + editingCommentId, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text, postId: postId })
        });
    } else {
        // CREATE (POST) - ID tự tăng
        let newId = getNextCommentId();
        res = await fetch(API_URL + '/comments', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: newId, text: text, postId: postId })
        });
    }

    if (res.ok) {
        alert(editingCommentId ? "Sửa comment thành công!" : "Thêm comment thành công!");
        CancelEditComment();
        LoadComments();
    } else {
        alert("Lỗi khi lưu comment!");
    }
}

// ========================================
// COMMENTS - EDIT
// ========================================
function EditComment(id) {
    let comment = allComments.find(c => c.id === id);
    if (!comment) return;

    editingCommentId = id;
    document.getElementById("comment_id_txt").value = id;
    document.getElementById("comment_text_txt").value = comment.text;
    document.getElementById("comment_postid_txt").value = comment.postId;
}

// ========================================
// COMMENTS - HỦY EDIT
// ========================================
function CancelEditComment() {
    editingCommentId = null;
    document.getElementById("comment_id_txt").value = "";
    document.getElementById("comment_text_txt").value = "";
    document.getElementById("comment_postid_txt").value = "";
}

// ========================================
// COMMENTS - XÓA (xóa cứng cho comments)
// ========================================
async function DeleteComment(id) {
    if (!confirm("Bạn có chắc muốn xóa comment #" + id + "?")) return;

    let res = await fetch(API_URL + '/comments/' + id, {
        method: 'DELETE'
    });

    if (res.ok) {
        alert("Xóa comment thành công!");
        LoadComments();
    } else {
        alert("Lỗi khi xóa comment!");
    }
}

// ========================================
// KHỞI CHẠY
// ========================================
LoadPosts();
LoadComments();
