import { beforeEach, describe, expect, it } from 'vitest';
import { generatePosts } from '../data/posts';
import { db } from './db';
import { listMine, parseStatus, resolvePost, submitPost } from './my-posts';

const SV01 = 'sv01@ptit.edu.vn';
const SV02 = 'sv02@ptit.edu.vn';

beforeEach(() => {
  // Đưa dữ liệu về ban đầu, chỉ sửa trực tiếp mảng db.posts
  db.posts.splice(0, db.posts.length, ...generatePosts(36));
  db.nextPostId = 37;
});

describe('listMine', () => {
  it('sv01 có 27 tin, lần đầu lấy 8 tin', () => {
    const page = listMine(SV01, undefined);
    expect(page.total).toBe(27);
    expect(page.items).toHaveLength(8);
    expect(page.nextCursor).toBe(8);
  });

  it('trang cuối có 3 tin và hết trang', () => {
    const page = listMine(SV01, undefined, 24);
    expect(page.items).toHaveLength(3);
    expect(page.nextCursor).toBeNull();
  });

  it('lọc được theo trạng thái và theo người đăng', () => {
    expect(listMine(SV01, 'pending').total).toBe(3);
    expect(listMine(SV02, undefined).total).toBe(9);
  });

  it('parseStatus bỏ qua giá trị lạ', () => {
    expect(parseStatus('hidden')).toBe('hidden');
    expect(parseStatus('abc')).toBeUndefined();
  });
});

describe('submitPost', () => {
  it('tạo tin chờ duyệt, ghép liên hệ vào mô tả và đặt ở đầu mảng', () => {
    const post = submitPost(SV01, {
      title: 'Mất tai nghe không dây',
      kind: 'Thất lạc',
      category: 'Khác',
      place: 'Thư viện',
      date: '2026-11-10',
      description: 'Tai nghe màu trắng, để quên ở thư viện.',
      contactType: 'Zalo',
      contact: '0912345678',
    });
    expect(post).toMatchObject({ id: 37, status: 'pending', resolved: false });
    expect(post.description).toBe(
      'Tai nghe màu trắng, để quên ở thư viện.\nLiên hệ: Zalo 0912345678',
    );
    expect(db.posts[0]).toBe(post);
  });
});

describe('resolvePost', () => {
  it('báo not-found khi không có tin', () => {
    expect(resolvePost(SV01, 999)).toBe('not-found');
  });

  it('báo forbidden khi không phải tin của mình', () => {
    expect(resolvePost(SV02, 2)).toBe('forbidden');
  });

  it('báo not-approved khi tin đang chờ duyệt', () => {
    expect(resolvePost(SV01, 11)).toBe('not-approved');
  });

  it('đánh dấu đã nhận lại tin của mình', () => {
    expect(resolvePost(SV01, 2)).toBe('ok');
    expect(db.posts.find((p) => p.id === 2)?.resolved).toBe(true);
  });
});
