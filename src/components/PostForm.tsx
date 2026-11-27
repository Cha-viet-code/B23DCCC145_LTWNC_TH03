'use client';

import { useActionState } from 'react';
import { CATEGORIES, KINDS, PLACES } from '../data/posts';
import type { PostFormState, PostInput } from '../lib/post-validate';

type PostFormAction = (prev: PostFormState, formData: FormData) => Promise<PostFormState>;

const initialState: PostFormState = { errors: {}, values: {} };

const CONTACT_TYPES = ['Zalo', 'SĐT', 'Email'];

interface SelectField {
  name: 'kind' | 'category' | 'place';
  label: string;
  options: readonly string[];
}

const SELECTS: SelectField[] = [
  { name: 'kind', label: 'Loại tin', options: KINDS },
  { name: 'category', label: 'Danh mục', options: CATEGORIES },
  { name: 'place', label: 'Địa điểm', options: PLACES },
];

export default function PostForm({ action }: { action: PostFormAction }) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const { errors, values } = state;

  const error = (name: keyof PostInput) =>
    errors[name] && <p role="alert">{errors[name]}</p>;

  return (
    // React 19 reset form sau mỗi lần gửi; đổi key để dựng lại các ô theo values
    <form className="post-form" action={formAction} key={JSON.stringify(values)}>
      <div className="field">
        <label htmlFor="title">Tiêu đề</label>
        <input id="title" name="title" defaultValue={values.title} />
        {error('title')}
      </div>

      {SELECTS.map(({ name, label, options }) => (
        <div className="field" key={name}>
          <label htmlFor={name}>{label}</label>
          <select id={name} name={name} defaultValue={values[name] ?? ''}>
            <option value="">-- Chọn --</option>
            {options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          {error(name)}
        </div>
      ))}

      <div className="field">
        <label htmlFor="date">Ngày</label>
        <input id="date" name="date" type="date" defaultValue={values.date} />
        {error('date')}
      </div>

      <div className="field">
        <label htmlFor="description">Mô tả</label>
        <textarea id="description" name="description" rows={4} defaultValue={values.description} />
        {error('description')}
      </div>

      <div className="field">
        <label htmlFor="contactType">Loại liên hệ</label>
        <select id="contactType" name="contactType" defaultValue={values.contactType ?? 'Zalo'}>
          {CONTACT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {error('contactType')}
      </div>

      <div className="field">
        <label htmlFor="contact">Thông tin liên hệ</label>
        <input id="contact" name="contact" defaultValue={values.contact} />
        {error('contact')}
      </div>

      <button type="submit" disabled={pending}>Đăng tin</button>
      {state.message && (
        <p role={state.ok ? 'status' : 'alert'}>{state.message}</p>
      )}
    </form>
  );
}
