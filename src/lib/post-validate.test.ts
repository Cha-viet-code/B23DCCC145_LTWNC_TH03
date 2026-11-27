import { describe, expect, it } from 'vitest';
import { toPostInput, validatePost, type PostInput } from './post-validate';

const valid: PostInput = {
  title: 'Mất tai nghe không dây',
  kind: 'Thất lạc',
  category: 'Khác',
  place: 'Thư viện',
  date: '2020-01-01',
  description: 'Tai nghe màu trắng, để quên ở bàn gần cửa sổ.',
  contactType: 'Zalo',
  contact: '0912345678',
};

const check = (changes: Partial<PostInput>) => validatePost({ ...valid, ...changes });

describe('validatePost', () => {
  it('tin hợp lệ trả về object rỗng', () => {
    expect(validatePost(valid)).toEqual({});
  });

  it('form trống báo đủ lỗi', () => {
    expect(validatePost(toPostInput(new FormData()))).toEqual({
      title: 'Tiêu đề tối thiểu 5 ký tự',
      kind: 'Hãy chọn loại tin',
      category: 'Hãy chọn danh mục',
      place: 'Hãy chọn địa điểm',
      date: 'Hãy chọn ngày',
      description: 'Mô tả tối thiểu 20 ký tự',
      contact: 'Số Zalo gồm 10 chữ số, bắt đầu bằng 0',
    });
  });

  it('không nhận ngày ở tương lai', () => {
    expect(check({ date: '2999-01-01' }).date).toBe('Ngày không được ở tương lai');
  });

  it('tiêu đề dưới 5 ký tự sau khi trim bị lỗi', () => {
    expect(check({ title: '   abcd   ' }).title).toBe('Tiêu đề tối thiểu 5 ký tự');
  });

  it('tiêu đề trên 80 ký tự bị lỗi', () => {
    expect(check({ title: 'a'.repeat(81) }).title).toBe('Tiêu đề tối đa 80 ký tự');
  });

  it('loại tin không tồn tại bị lỗi', () => {
    expect(check({ kind: 'Cho tặng' }).kind).toBe('Hãy chọn loại tin');
  });

  it('kiểm tra định dạng liên hệ Email', () => {
    expect(check({ contactType: 'Email', contact: 'abc' }).contact).toBe('Email không hợp lệ');
    expect(check({ contactType: 'Email', contact: 'a@b.c' })).toEqual({});
  });

  it('số điện thoại thiếu số bị lỗi', () => {
    expect(check({ contactType: 'SĐT', contact: '091234567' }).contact).toBe(
      'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0',
    );
  });

  it('loại liên hệ lạ bị lỗi', () => {
    expect(check({ contactType: 'Fax' }).contact).toBe('Hãy chọn loại liên hệ');
  });
});

describe('toPostInput', () => {
  it('trường thiếu thành chuỗi rỗng, loại liên hệ mặc định là Zalo', () => {
    const input = toPostInput({ title: 'Mất ví' });
    expect(input.title).toBe('Mất ví');
    expect(input.contact).toBe('');
    expect(input.contactType).toBe('Zalo');
  });
});
