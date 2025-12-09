'use client';

import { useState, useEffect } from 'react';
import { managerApi, Document } from '../../../../../lib/api-client';
import { useToastContext } from '../../../../../components/ToastProvider';
import { DataTable } from '../../../../../components/common/DataTable';
import { FormModal } from '../../../../../components/common/FormModal';

export function DocumentsTab({ propertyId }: { propertyId: string }) {
  const toast = useToastContext();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    documentType: '',
    fileName: '',
    fileUrl: '',
    description: '',
  });

  useEffect(() => {
    loadDocuments();
  }, [propertyId]);

  async function loadDocuments() {
    try {
      setLoading(true);
      const data = await managerApi.getDocuments(propertyId);
      setDocuments(data || []);
    } catch (err: any) {
      toast.error(err.message || 'Ошибка загрузки документов');
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setFormData({
      documentType: '',
      fileName: '',
      fileUrl: '',
      description: '',
    });
    setShowModal(true);
  }

  async function handleSubmit() {
    if (!formData.documentType.trim()) {
      toast.error('Укажите тип документа');
      return;
    }

    if (!formData.fileName.trim()) {
      toast.error('Укажите имя файла');
      return;
    }

    if (!formData.fileUrl.trim()) {
      toast.error('Укажите URL файла');
      return;
    }

    try {
      await managerApi.uploadDocument(propertyId, {
        documentType: formData.documentType,
        fileName: formData.fileName,
        fileUrl: formData.fileUrl,
        description: formData.description || undefined,
      });

      toast.success('Документ загружен');
      setShowModal(false);
      await loadDocuments();
    } catch (err: any) {
      toast.error(err.message || 'Ошибка загрузки документа');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Удалить этот документ?')) return;

    try {
      await managerApi.deleteDocument(id);
      toast.success('Документ удалён');
      await loadDocuments();
    } catch (err: any) {
      toast.error(err.message || 'Ошибка удаления');
    }
  }

  const columns = [
    { key: 'type', label: 'Тип' },
    { key: 'fileName', label: 'Имя файла' },
    { key: 'version', label: 'Версия' },
    { key: 'description', label: 'Описание' },
    { key: 'createdAt', label: 'Дата загрузки' },
    { key: 'actions', label: 'Действия' },
  ];

  const rows = documents.map((doc) => ({
    id: doc.id,
    type: doc.type,
    fileName: doc.fileName,
    version: `v${doc.version}`,
    description: doc.description ? (doc.description.length > 50 ? doc.description.substring(0, 50) + '...' : doc.description) : '-',
    createdAt: new Date(doc.createdAt).toLocaleDateString('ru-RU'),
    actions: (
      <div className="flex gap-2">
        <a
          href={doc.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-sabay-primary/10 border border-sabay-primary text-sabay-primary rounded-lg hover:bg-sabay-primary/20 transition text-sm"
        >
          Открыть
        </a>
        <button
          onClick={() => handleDelete(doc.id)}
          className="px-3 py-1 bg-red-500/10 border border-red-500 text-red-500 rounded-lg hover:bg-red-500/20 transition text-sm"
        >
          Удалить
        </button>
      </div>
    ),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Документы</h3>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-sabay-primary rounded-lg hover:bg-sabay-primary/90 transition text-sm font-medium"
        >
          + Загрузить документ
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-white/60">Загрузка...</div>
      ) : documents.length === 0 ? (
        <div className="text-center py-8 text-white/60">Нет документов</div>
      ) : (
        <DataTable columns={columns} rows={rows} />
      )}

      {showModal && (
        <FormModal
          title="Загрузить документ"
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Тип документа *</label>
              <input
                type="text"
                value={formData.documentType}
                onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="Contract, Invoice, Report, HandoverAct"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Имя файла *</label>
              <input
                type="text"
                value={formData.fileName}
                onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="document.pdf"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL файла *</label>
              <input
                type="url"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="https://..."
                required
              />
              <p className="text-xs text-white/50 mt-1">Введите URL загруженного файла</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Описание</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                rows={3}
                placeholder="Описание документа"
              />
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
}
