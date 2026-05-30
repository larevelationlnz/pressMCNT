import { useState, useEffect } from 'react';

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const AuthorsManager = ({ authors, onAddClick, onEditClick, onDeleteClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const filteredAuthors = authors.filter((author) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      (author.lastName && author.lastName.toLowerCase().includes(query)) ||
      (author.firstName && author.firstName.toLowerCase().includes(query)) ||
      (author.profession && author.profession.toLowerCase().includes(query)) ||
      (author.cniNumber && author.cniNumber.toLowerCase().includes(query)) ||
      (author.email && author.email.toLowerCase().includes(query))
    );
  });

  const totalPages = Math.ceil(filteredAuthors.length / ITEMS_PER_PAGE);
  const displayedAuthors = filteredAuthors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  return (
    <div className="content-area fade-in" style={{ gap: '12px' }}>

      {/* ── En-tête : titre + bouton créer ── */}
      <div className="content-header" style={{ marginBottom: 0 }}>
        <div className="content-title-wrapper">
          <span className="content-title-icon"><UsersIcon /></span>
          <h2 className="content-title">Gestion des auteurs</h2>
        </div>
        <button
          id="btn-creer-auteur"
          className="btn btn-primary"
          onClick={onAddClick}
          style={{ whiteSpace: 'nowrap', fontSize: '0.85rem', padding: '8px 16px' }}
        >
          + Créer un auteur
        </button>
      </div>

      {/* ── Barre de recherche ── */}
      <div style={{ position: 'relative', width: '100%' }}>
        <span style={{
          position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-muted)', display: 'flex', alignItems: 'center', pointerEvents: 'none'
        }}>
          <SearchIcon />
        </span>
        <input
          id="search-auteurs"
          type="text"
          placeholder="Rechercher par nom, prénom, profession, N° CNI ou email…"
          className="form-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            paddingLeft: '38px',
            paddingRight: searchQuery ? '38px' : '14px',
            paddingTop: '9px',
            paddingBottom: '9px',
            fontSize: '0.88rem',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-sm)',
          }}
          aria-label="Rechercher un auteur"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            aria-label="Effacer la recherche"
            style={{
              position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '4px'
            }}
          >
            <XIcon />
          </button>
        )}
      </div>

      {/* Compteur résultats */}
      {searchQuery.trim() && (
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0' }}>
          {filteredAuthors.length} résultat{filteredAuthors.length !== 1 ? 's' : ''} pour «&nbsp;{searchQuery}&nbsp;»
        </p>
      )}

      {/* ── Tableau ── */}
      <div className="table-container" style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'auto',
          fontSize: '0.875rem',
        }}>
          <thead>
            <tr>
              {['Nom', 'Prénom', 'Profession', 'N° CNI', 'Email', 'Date', 'Actions'].map((col) => (
                <th key={col} style={{
                  padding: '10px 12px',
                  background: 'hsl(210, 100%, 98%)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.4px',
                  borderBottom: '1px solid var(--border-color)',
                  whiteSpace: 'nowrap',
                  textAlign: 'left',
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedAuthors.length === 0 ? (
              <tr>
                <td colSpan="7" style={{
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  padding: '32px 16px',
                  fontStyle: 'italic',
                  fontSize: '0.9rem'
                }}>
                  {searchQuery.trim()
                    ? `Aucun auteur trouvé pour « ${searchQuery} ».`
                    : "Aucun auteur enregistré. Cliquez sur « + Créer un auteur » pour commencer."}
                </td>
              </tr>
            ) : (
              displayedAuthors.map((author) => (
                <tr key={author.id} style={{ transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'hsl(210, 20%, 98%)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>
                    {author.lastName}
                  </td>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>
                    {author.firstName}
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                    {author.profession}
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', fontFamily: 'monospace', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    {author.cniNumber}
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {author.email}
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                    {author.createdAt ? new Date(author.createdAt).toLocaleDateString('fr-FR') : '—'}
                  </td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button
                        className="btn-action btn-action-edit"
                        onClick={() => onEditClick(author)}
                        title={`Modifier ${author.firstName} ${author.lastName}`}
                        aria-label={`Modifier ${author.firstName} ${author.lastName}`}
                        style={{ width: '30px', height: '30px' }}
                      >
                        <PencilIcon />
                      </button>
                      <button
                        className="btn-action btn-action-delete"
                        onClick={() => onDeleteClick(author.id)}
                        title={`Supprimer ${author.firstName} ${author.lastName}`}
                        aria-label={`Supprimer ${author.firstName} ${author.lastName}`}
                        style={{ width: '30px', height: '30px' }}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer compteur total et pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', margin: 0 }}>
          Affichage de {displayedAuthors.length} sur {filteredAuthors.length} auteur{filteredAuthors.length !== 1 ? 's' : ''}
        </p>
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: '4px' }}>
            <button className="btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Précédent</button>
            <span style={{ fontSize: '0.8rem', padding: '4px 8px', display: 'flex', alignItems: 'center' }}>Page {currentPage} sur {totalPages}</span>
            <button className="btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Suivant</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorsManager;
