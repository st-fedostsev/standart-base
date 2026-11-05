import { useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { CellLines, DataTable, type Column } from '@/components/DataTable';
import { EmptyState } from '@/components/EmptyState';
import { MassActionsPanel } from '@/components/MassActionsPanel';
import { PageLayout } from '@/components/PageLayout';
import { PermissionGuard } from '@/components/PermissionGuard';
import { SearchInput } from '@/components/SearchInput';
import { ROLES } from '@/utils/types/roles';

import { DeleteForeverOutlined } from '@mui/icons-material/';
import AddIcon from '@mui/icons-material/Add';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import SearchOffOutlined from '@mui/icons-material/SearchOffOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { Button, Chip } from '@mui/material/';

// Статусы из раздела модерации брифа. Набор предположение TODO подтвердить
type CardStatus = 'draft' | 'review' | 'published' | 'returned' | 'archived';

const STATUS_LABELS: Record<CardStatus, string> = {
  draft: 'Черновик',
  review: 'На согласовании',
  published: 'Опубликован',
  returned: 'Возвращён',
  archived: 'В архиве',
};

type CardRow = {
  id: string;
  title: string;
  status: CardStatus;
  updatedAt: string;
};

// Общий пустой массив. Иначе `data = []` создаёт новый массив при каждом рендере и ломает useMemo
const NO_CARDS: CardRow[] = [];

// Мок-данные: временно, до появления эндпоинта. Перед коммитом поставьте USE_MOCK = false
const USE_MOCK = true;

const MOCK_CARDS: CardRow[] = [
  {
    id: '1',
    title: 'Правила оформления материала',
    status: 'published',
    updatedAt: '2026-10-28T09:15:00',
  },
  {
    id: '2',
    title: 'Чек-лист перед публикацией',
    status: 'draft',
    updatedAt: '2026-11-02T14:40:00',
  },
  {
    id: '3',
    title: 'Пример: сокращение времени переналадки',
    status: 'review',
    updatedAt: '2026-10-30T11:05:00',
  },
  {
    id: '4',
    title: 'Шаблон описания показателей',
    status: 'returned',
    updatedAt: '2026-10-21T16:20:00',
  },
  {
    id: '5',
    title: 'Ведение журнала обращений',
    status: 'archived',
    updatedAt: '2026-09-12T10:00:00',
  },
  {
    id: '6',
    title: 'Порядок согласования правок',
    status: 'draft',
    updatedAt: '2026-11-03T08:30:00',
  },
];

const columns: Column<CardRow>[] = [
  {
    key: 'title',
    title: 'Название',
    sortValue: (c) => c.title,
    render: (c) => <CellLines primary={c.title} />,
  },
  {
    key: 'status',
    title: 'Статус',
    width: 200,
    render: (c) => (
      <Chip size='small' variant='outlined' label={STATUS_LABELS[c.status]} />
    ),
  },
  {
    key: 'updatedAt',
    title: 'Обновлено',
    width: 200,
    align: 'right',
    sortValue: (c) => new Date(c.updatedAt).getTime(),
    render: (c) => (
      <CellLines
        primary={new Date(c.updatedAt).toLocaleString('ru-RU', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}
      />
    ),
  },
];

// Отправить можно черновик и возвращённый материал
const canSendToReview = (card: CardRow) =>
  card.status === 'draft' || card.status === 'returned';

export function CardsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  // Заглушка: эндпоинта пока нет. Замените queryFn на запрос к backend
  const {
    data: cards = NO_CARDS,
    isPending,
    isError,
  } = useQuery<CardRow[]>({
    queryKey: ['cards'],
    queryFn: async () => {
      if (USE_MOCK) {
        // Задержка нужна, чтобы увидеть скелетоны загрузки. Уберите, когда она не нужна
        await new Promise((resolve) => setTimeout(resolve, 400));
        return MOCK_CARDS;
      }
      // TODO: запрос к backend, например api.Cards.list()
      return [];
    },
  });

  // Поиск на клиенте только для заглушки. С backend строка уходит в запрос
  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q === '') return cards;
    return cards.filter((c) => c.title.toLowerCase().includes(q));
  }, [cards, search]);

  const selectedRows = useMemo(
    () => cards.filter((c) => selected.has(c.id)),
    [cards, selected]
  );
  const allSendable =
    selectedRows.length > 0 && selectedRows.every(canSendToReview);

  // Выбор привязан к видимым строкам: при смене поиска сбрасываем
  const changeSearch = (value: string) => {
    setSearch(value);
    setSelected(new Set());
  };

  // Отправка на согласование для набора id. Снимает эти строки из выбора
  const sendToReview = (ids: string[]) => {
    // TODO: запрос к backend, например POST /api/cards/send-to-review с ids
    setSelected((prev) => new Set([...prev].filter((id) => !ids.includes(id))));
  };

  const emptyState = search ? (
    <EmptyState
      icon={SearchOffOutlined}
      description='По вашему запросу ничего не найдено. Измените запрос или сбросьте поиск.'
      action={
        <Button variant='text' onClick={() => changeSearch('')}>
          Сбросить поиск
        </Button>
      }
    />
  ) : (
    <EmptyState
      icon={DescriptionOutlined}
      description='Здесь будут ваши материалы. Создайте первый, чтобы начать.'
      action={
        <PermissionGuard allowed={[ROLES.Author, ROLES.Admin]}>
          <Button
            variant='outlined'
            startIcon={<AddIcon />}
            onClick={() => navigate('/cards/new')}
          >
            Создать материал
          </Button>
        </PermissionGuard>
      }
    />
  );

  return (
    <PageLayout
      title='Мои карточки'
      subtitle={isPending ? undefined : `Материалов: ${cards.length}`}
      actions={
        <PermissionGuard allowed={[ROLES.Author, ROLES.Admin]}>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={() => navigate('/cards/new')}
          >
            Создать материал
          </Button>
        </PermissionGuard>
      }
      filters={
        <SearchInput
          value={search}
          onChange={changeSearch}
          placeholder='Поиск по названию'
        />
      }
    >
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(c) => c.id}
        selectedIds={selected}
        onSelectedIdsChange={setSelected}
        onRowClick={(c) => navigate(`/cards/${c.id}`)}
        massActionsPanel={({ count, selectAll, clear }) => (
          <MassActionsPanel
            count={count}
            onClear={clear}
            onSelectAll={selectAll}
            actions={[
              {
                id: 'send',
                label: 'Удалить все нафиг',
                icon: DeleteForeverOutlined,
                disabled: !allSendable,
                onClick: () => sendToReview([...selected]),
              },
            ]}
          />
        )}
        kebabMenu={(u) => [
          {
            id: 'open',
            label: 'Открыть',
            icon: VisibilityOutlined,
            onClick: () => navigate(`/users/${u.id}`),
          },
        ]}
        isLoading={isPending}
        errorText={
          isError ? 'Не удалось загрузить данные. Попробуйте позже' : undefined
        }
        empty={emptyState}
        dataTid='cards-table'
      />
    </PageLayout>
  );
}
