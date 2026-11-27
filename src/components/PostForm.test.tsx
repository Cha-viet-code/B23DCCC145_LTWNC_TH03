import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { PostFormState } from '../lib/post-validate';
import PostForm from './PostForm';

type Action = (prev: PostFormState, formData: FormData) => Promise<PostFormState>;

const fakeAction = (state: PostFormState) => vi.fn<Action>().mockResolvedValue(state);
const submitButton = () => screen.getByRole('button', { name: 'Đăng tin' });

describe('PostForm', () => {
  it('hiện lỗi dưới đúng ô khi action trả về errors', async () => {
    const user = userEvent.setup();
    const action = fakeAction({
      errors: { title: 'Tiêu đề tối thiểu 5 ký tự' },
      values: {},
    });
    render(<PostForm action={action} />);

    await user.click(submitButton());

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Tiêu đề tối thiểu 5 ký tự');
    expect(screen.getByLabelText('Tiêu đề').parentElement).toContainElement(alert);
  });

  it('gửi đúng dữ liệu người dùng đã điền', async () => {
    const user = userEvent.setup();
    const action = fakeAction({ errors: {}, values: {} });
    render(<PostForm action={action} />);

    await user.type(screen.getByLabelText('Tiêu đề'), 'Mất tai nghe không dây');
    await user.selectOptions(screen.getByLabelText('Loại tin'), 'Thất lạc');
    await user.selectOptions(screen.getByLabelText('Danh mục'), 'Khác');
    await user.selectOptions(screen.getByLabelText('Địa điểm'), 'Thư viện');
    await user.type(screen.getByLabelText('Ngày'), '2020-01-01');
    await user.type(screen.getByLabelText('Mô tả'), 'Tai nghe màu trắng, để quên ở thư viện.');
    await user.selectOptions(screen.getByLabelText('Loại liên hệ'), 'Email');
    await user.type(screen.getByLabelText('Thông tin liên hệ'), 'a@b.c');
    await user.click(submitButton());

    await vi.waitFor(() => expect(action).toHaveBeenCalledTimes(1));
    const formData = action.mock.calls[0][1];
    expect(formData.get('kind')).toBe('Thất lạc');
    expect(formData.get('contactType')).toBe('Email');
    expect(formData.get('contact')).toBe('a@b.c');
  });

  it('hiện thông báo và giữ tiêu đề đã nhập khi không có quyền', async () => {
    const user = userEvent.setup();
    const action = fakeAction({
      errors: {},
      values: { title: 'Mất ví da' },
      message: 'Không có quyền',
    });
    render(<PostForm action={action} />);

    await user.type(screen.getByLabelText('Tiêu đề'), 'Mất ví da');
    await user.click(submitButton());

    expect(await screen.findByText('Không có quyền')).toBeInTheDocument();
    expect(screen.getByLabelText('Tiêu đề')).toHaveValue('Mất ví da');
  });

  it('mặc định loại liên hệ là Zalo', () => {
    render(<PostForm action={fakeAction({ errors: {}, values: {} })} />);
    expect(screen.getByLabelText('Loại liên hệ')).toHaveValue('Zalo');
  });
});
