import { CATEGORIES, KINDS, PLACES } from '../data/posts';

export interface PostInput {
  title: string; kind: string; category: string; place: string;
  date: string; description: string;
  contactType: string; contact: string;
}
export type PostErrors = Partial<Record<keyof PostInput, string>>;
export interface PostFormState {
  errors: PostErrors; // lỗi từng ô
  values: Partial<PostInput>; // giá trị đã nhập, để hiện lại khi có lỗi
  message?: string; // thông báo chung (thành công hoặc lỗi từ server)
  ok?: boolean; // true nếu message là thông báo thành công
}

export function toPostInput(raw: FormData | Record<string, unknown>): PostInput {
  const read = (key: keyof PostInput, fallback = ''): string => {
    const value = raw instanceof FormData ? raw.get(key) : raw[key];
    return typeof value === 'string' ? value : fallback;
  };
  return {
    title: read('title'),
    kind: read('kind'),
    category: read('category'),
    place: read('place'),
    date: read('date'),
    description: read('description'),
    contactType: read('contactType', 'Zalo'),
    contact: read('contact'),
  };
}

/** Ngày hôm nay (theo giờ máy chủ) dạng YYYY-MM-DD. */
export function today(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

const isIsoDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  // Loại các ngày không tồn tại như 2026-02-30
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
};

const isOneOf = (list: readonly string[], value: string): boolean => list.includes(value);

const PHONE = /^0\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function checkContact(type: string, contact: string): string | undefined {
  switch (type) {
    case 'Zalo':
      return PHONE.test(contact) ? undefined : 'Số Zalo gồm 10 chữ số, bắt đầu bằng 0';
    case 'SĐT':
      return PHONE.test(contact) ? undefined : 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0';
    case 'Email':
      return EMAIL.test(contact) ? undefined : 'Email không hợp lệ';
    default:
      return 'Hãy chọn loại liên hệ';
  }
}

export function validatePost(input: PostInput): PostErrors {
  const errors: PostErrors = {};
  const title = input.title.trim();

  if (title.length < 5) errors.title = 'Tiêu đề tối thiểu 5 ký tự';
  else if (title.length > 80) errors.title = 'Tiêu đề tối đa 80 ký tự';

  if (!isOneOf(KINDS, input.kind)) errors.kind = 'Hãy chọn loại tin';
  if (!isOneOf(CATEGORIES, input.category)) errors.category = 'Hãy chọn danh mục';
  if (!isOneOf(PLACES, input.place)) errors.place = 'Hãy chọn địa điểm';

  if (!isIsoDate(input.date)) errors.date = 'Hãy chọn ngày';
  else if (input.date > today()) errors.date = 'Ngày không được ở tương lai';

  if (input.description.trim().length < 20) errors.description = 'Mô tả tối thiểu 20 ký tự';

  const contactError = checkContact(input.contactType, input.contact.trim());
  if (contactError) errors.contact = contactError;

  return errors;
}
