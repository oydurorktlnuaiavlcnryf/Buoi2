// ========================================
// Quản Lý Posts - Trần Biện Minh Tâm
// MSSV: 2280614642
// ========================================

const API_URL = 'http://localhost:3000/posts';

// Lưu toàn bộ data để filter/sort không cần fetch lại
let allPosts = [];

// ========================================
// 1. LOAD DATA - Fetch từ API
// ========================================
async function Load() {
    try {
        let res = await fetch(API_URL);
        let data = await res.json();
        allPosts = data;
        renderTable(allPosts);
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        let body = document.getElementById("table-body");
        body.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-danger py-4">
                    <i class="bi bi-exclamation-triangle" style="font-size: 2rem;"></i>
                    <p class="mt-2">Không thể kết nối server!<br>
                    <small>Hãy chạy: <code>npx json-server db.json</code></small></p>
                </td>
            </tr>`;
    }
}

// ========================================
// 2. RENDER TABLE - Hiển thị data ra bảng
// ========================================
function renderTable(data) {
    let body = document.getElementById("table-body");
    let countBadge = document.getElementById("count_badge");

    // Cập nhật badge count
    countBadge.textContent = data.length + " posts";

    // Nếu không có data
    if (data.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted py-4">
                    <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                    <p class="mt-2">Không tìm thấy kết quả</p>
                </td>
            </tr>`;
        return;
    }

    // Render từng row
    body.innerHTML = "";
    for (const post of data) {
        body.innerHTML += `
            <tr>
                <td><span class="badge bg-secondary">${post.id}</span></td>
                <td>${post.title}</td>
                <td><span class="badge bg-info text-dark">${post.views}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="Edit('${post.id}', '${post.title}', '${post.views}')">
                        <i class="bi bi-pencil"></i> Sửa
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="Delete('${post.id}')">
                        <i class="bi bi-trash"></i> Xóa
                    </button>
                </td>
            </tr>`;
    }
}

// ========================================
// 3. SEARCH - Tìm kiếm theo tên (onChanged)
// ========================================
function onChanged() {
    let keyword = document.getElementById("search_input").value.toLowerCase().trim();

    // Filter theo title
    let filtered = allPosts.filter(function(post) {
        return post.title.toLowerCase().includes(keyword);
    });

    renderTable(filtered);
}

// ========================================
// 4. SORT - Sắp xếp theo tên / views
// ========================================
function sortBy(field, order) {
    // Lấy data hiện tại (có thể đã được filter)
    let keyword = document.getElementById("search_input").value.toLowerCase().trim();
    let data = allPosts.filter(function(post) {
        return post.title.toLowerCase().includes(keyword);
    });

    // Sắp xếp
    data.sort(function(a, b) {
        let valA, valB;

        if (field === 'title') {
            // So sánh text
            valA = a.title.toLowerCase();
            valB = b.title.toLowerCase();
            if (order === 'asc') {
                return valA.localeCompare(valB);
            } else {
                return valB.localeCompare(valA);
            }
        } else if (field === 'views') {
            // So sánh số
            valA = parseInt(a.views) || 0;
            valB = parseInt(b.views) || 0;
            if (order === 'asc') {
                return valA - valB;
            } else {
                return valB - valA;
            }
        }
    });

    renderTable(data);
}

// ========================================
// 5. SAVE - Thêm hoặc Sửa post
// ========================================
async function Save() {
    let id = document.getElementById("id_txt").value.trim();
    let title = document.getElementById("title_txt").value.trim();
    let views = document.getElementById("views_txt").value.trim();

    if (!id || !title || !views) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    let res;
    let getID = await fetch(API_URL + '/' + id);

    if (getID.ok) {
        // UPDATE (PUT)
        res = await fetch(API_URL + '/' + id, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: title, views: views })
        });
    } else {
        // CREATE (POST)
        res = await fetch(API_URL, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: id, title: title, views: views })
        });
    }

    if (res.ok) {
        alert("Lưu thành công!");
        // Clear form
        document.getElementById("id_txt").value = "";
        document.getElementById("title_txt").value = "";
        document.getElementById("views_txt").value = "";
        // Reload data
        Load();
    } else {
        alert("Lỗi khi lưu!");
    }
}

// ========================================
// 6. EDIT - Điền data vào form để sửa
// ========================================
function Edit(id, title, views) {
    document.getElementById("id_txt").value = id;
    document.getElementById("title_txt").value = title;
    document.getElementById("views_txt").value = views;
}

// ========================================
// 7. DELETE - Xóa post
// ========================================
async function Delete(id) {
    if (!confirm("Bạn có chắc muốn xóa post #" + id + "?")) {
        return;
    }

    let res = await fetch(API_URL + '/' + id, {
        method: 'DELETE'
    });

    if (res.ok) {
        alert("Xóa thành công!");
        Load();
    } else {
        alert("Lỗi khi xóa!");
    }
}

// ========================================
// KHỞI CHẠY
// ========================================
Load();
