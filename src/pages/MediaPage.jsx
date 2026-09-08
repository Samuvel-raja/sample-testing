import { useState } from 'react';
import { useStore } from '../store';
import { Field, EmptyState } from '../components/ui';
import Icon from '../components/Icon';
import Modal from '../components/Modal';
import { uid } from '../data';

const IMG_RE = /\.(jpe?g|png|webp)$/i;
const fmtSize = (b) => {
  if (b == null) return '—';
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
};

export default function MediaPage() {
  const { media, addMedia, updateMedia, deleteMedia, showToast, setConfirmState } = useStore();

  const [selId, setSelId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [dragging, setDragging] = useState(false);

  const selected = media.find((m) => m.id === selId) || null;

  const addFiles = (fileList) => {
    const files = Array.from(fileList).filter((f) => IMG_RE.test(f.name));
    if (!files.length) return;
    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                id: uid(),
                previewUrl: reader.result,
                name: file.name,
                size: file.size,
                description: '',
                createdAt: Date.now(),
              });
            reader.readAsDataURL(file);
          })
      )
    ).then((items) => {
      addMedia(items);
      showToast(`${items.length} image${items.length > 1 ? 's' : ''} uploaded`);
    });
  };

  const select = (m) => {
    setSelId(m.id);
    setDraft({ ...m });
  };
  const deselect = () => {
    setSelId(null);
    setDraft(null);
  };
  const setD = (partial) => setDraft((d) => ({ ...d, ...partial }));

  const save = () => {
    updateMedia(draft.id, { name: draft.name, description: draft.description });
    showToast('Image saved');
    deselect();
  };

  const remove = (m) => {
    setConfirmState({
      open: true,
      title: 'Delete image?',
      message: `"${m.name}" will be removed from the library.`,
      confirmLabel: 'Delete',
      onConfirm: () => {
        deleteMedia(m.id);
        if (selId === m.id) deselect();
        setConfirmState({ open: false });
        showToast('Image deleted');
      },
    });
  };

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Media</h1>
          <p className="page-sub">{media.length} images in the library</p>
        </div>
      </div>

      <label
        className={`dropzone${dragging ? ' drag' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
      >
        <span className="dropzone-icon"><Icon name="upload" size={20} /></span>
        <span className="dropzone-text"><strong>Drag &amp; drop images</strong> or click to browse</span>
        <span className="dropzone-hint">JPG, PNG or WEBP · multiple allowed</span>
        <input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp"
          className="visually-hidden"
          onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}
        />
      </label>

      <div className="worklist" style={{ marginTop: 18 }}>
        {media.length === 0 ? (
          <EmptyState icon="media" title="No images yet">
            Drag images onto the area above, or click it to browse.
          </EmptyState>
        ) : (
          <div className="media-grid">
            {media.map((m) => (
              <figure
                key={m.id}
                className={`media-card${selId === m.id ? ' is-selected' : ''}`}
                onClick={() => select(m)}
              >
                <div className="media-thumb">
                  <img src={m.previewUrl} alt={m.description || m.name} />
                  <button
                    type="button"
                    className="thumb-remove"
                    aria-label="Delete image"
                    onClick={(e) => { e.stopPropagation(); remove(m); }}
                  >
                    <Icon name="x" size={14} />
                  </button>
                </div>
                <figcaption>
                  <span className="media-name" title={m.name}>{m.name}</span>
                  <span className="media-meta">{m.description || 'No description'}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={!!selected}
        onClose={deselect}
        title="Image"
        footer={
          <>
            <button type="button" className="btn btn-ghost danger" onClick={() => remove(selected)}>
              Delete
            </button>
            <div className="grow" />
            <button type="submit" form="media-editor" className="btn btn-primary">
              Save
            </button>
          </>
        }
      >
        {selected && (
          <form id="media-editor" className="form-grid" onSubmit={(e) => { e.preventDefault(); save(); }}>
            <div className="media-preview">
              <img src={selected.previewUrl} alt={selected.description || selected.name} />
              <span className="media-meta">{fmtSize(selected.size)}</span>
            </div>

            <Field label="Name" htmlFor="md-name">
              <input
                id="md-name"
                type="text"
                className="input"
                autoFocus
                value={draft.name}
                onChange={(e) => setD({ name: e.target.value })}
              />
            </Field>

            <Field label="Description" htmlFor="md-desc" counter={`${(draft.description || '').length}/280`}>
              <textarea
                id="md-desc"
                className="textarea"
                rows={3}
                maxLength={280}
                placeholder="What the image shows"
                value={draft.description}
                onChange={(e) => setD({ description: e.target.value })}
              />
            </Field>
          </form>
        )}
      </Modal>
    </section>
  );
}
