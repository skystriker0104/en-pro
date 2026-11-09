# TOEIC LexiMaster - Sổ Tay & Từ Điển Học Tiếng Anh Chuẩn TOEIC (TypeScript + TSX)

Ứng dụng web chuyên nghiệp viết bằng **TypeScript / React (.tsx)** giúp bạn xây dựng, quản lý và ghi nhớ từ điển tiếng Anh cá nhân hóa bám sát cấu trúc đề thi TOEIC ETS.

---

## 💾 Lưu trữ dữ liệu trực tiếp trên máy Local

Dữ liệu từ điển được lưu trực tiếp vào tệp JSON trên ổ cứng máy tính của bạn:
- **Đường dẫn tệp**: `data/dictionary.json`
- Mọi thao tác: **Thêm từ mới, Sửa, Xóa, Đánh dấu đã thuộc, Ôn flashcard** đều được tự động lưu ngay lập tức vào tệp `data/dictionary.json` trên máy tính.
- Ngoài ra, ứng dụng còn đồng bộ vào `localStorage` của trình duyệt làm bộ nhớ đệm dự phòng.
- Bạn có thể mở tệp `data/dictionary.json` bằng VS Code, Notepad, sao chép hoặc chia sẻ rất dễ dàng.

---

## 🌟 5 Danh mục kiến thức cốt lõi chuẩn TOEIC

1. **📖 Nghĩa của từ (Vocabulary)**:
   - Từ loại, phiên âm quốc tế (IPA), phát âm âm thanh giọng chuẩn bản xứ (Web Speech API).
   - **Họ từ (Word Family)**: Noun, Verb, Adj, Adv – vũ khí tối thượng để giải nhanh câu hỏi từ loại trong TOEIC Part 5.
   - Cụm từ đi kèm (Collocations), từ đồng nghĩa (Synonyms), câu ví dụ ngữ cảnh đề thi.
   - **Mẹo & Bẫy TOEIC (Trap & Tips)**: Phân biệt các từ dễ gây nhầm lẫn trong đề thi.

2. **📐 Ngữ pháp (Grammar Points)**:
   - Hệ thống các chuyên đề hay thi nhất: *Rút gọn mệnh đề quan hệ, Thức giả định (Subjunctive), Hòa hợp chủ - vị (A number of vs The number of), Đảo ngữ...*
   - Công thức hiển thị dạng code nổi bật.
   - Phân tích bẫy đề thi Part 5 & Part 6.

3. **🔗 Cấu trúc & Cụm từ (Structures & Collocations)**:
   - Các mẫu câu cố định: `be subject to + N/V-ing`, `in accordance with`, `reluctant to V`...
   - Phân tích giới từ và dạng động từ đi kèm.

4. **🏢 Cụm danh từ (Noun Phrases & Compound Nouns)**:
   - Cực kỳ quan trọng trong TOEIC: `customer satisfaction survey`, `safety regulations`, `sales representative`, `feasibility study`...
   - Bóc tách cấu trúc Head Noun và danh từ bổ nghĩa.

5. **💡 Thành ngữ & Giao tiếp công sở (Idioms & Business Expressions)**:
   - Cụm từ hay gặp trong Part 3 (Hội thoại) & Part 4 (Bài nói): `touch base with`, `ahead of schedule`, `back to the drawing board`...
   - Giải thích ngữ cảnh giao tiếp và cách paraphrase trong đáp án.

---

## 🚀 Các tính năng vượt trội

- **🔍 Tra cứu tự động với Free Dictionary API**: Khi thêm từ mới, chỉ cần nhập từ tiếng Anh và bấm *"Tra tự động"* để tự điền phiên âm, từ loại, định nghĩa và ví dụ.
- **🔊 Phát âm chuẩn bản xứ**: Tích hợp Web Speech API đọc từ và câu ví dụ.
- **🎴 Chế độ Thẻ ghi nhớ Flashcard (Spaced Repetition)**: Lật thẻ 3D, đánh giá mức độ nhớ theo thang điểm để lên lịch ôn tập.
- **🎯 Luyện đề trắc nghiệm TOEIC Part 5**: Tự động sinh câu hỏi 4 lựa chọn (A, B, C, D) từ chính từ điển của bạn với giải thích chi tiết và hiệu ứng pháo hoa khi hoàn thành.
- **💾 Sao lưu & Xuất dữ liệu (JSON / Excel CSV)**:
  - Xuất dữ liệu sang định dạng **JSON** hoặc **CSV (Excel)**.
  - Khôi phục dữ liệu hoặc reset về bộ từ điển chuẩn TOEIC bất cứ lúc nào.
- **🌓 Chế độ Dark Mode / Light Mode**: Tùy biến giao diện hiện đại, êm dịu cho mắt khi học buổi tối.

---

## 🛠 Hướng dẫn chạy

```bash
# Cài đặt thư viện
npm install

# Khởi chạy server phát triển (TypeScript + Local storage middleware)
npm run dev

# Kiểm tra kiểu dữ liệu và build ứng dụng
npm run build

# Mở trình duyệt tại:
http://127.0.0.1:5173
```
