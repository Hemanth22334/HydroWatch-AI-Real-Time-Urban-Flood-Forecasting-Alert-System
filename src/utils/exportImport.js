/**
 * Data Export, Import, and Backup Utility
 */

export function exportUserData(studyData) {
  const exportPayload = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    subjects: studyData.subjects || [],
    goals: studyData.goals || [],
    sessions: studyData.sessions || [],
    decks: studyData.decks || [],
    flashcards: studyData.flashcards || [],
    quotes: studyData.quotes || [],
    achievements: studyData.achievements || [],
    settings: studyData.userSettings || {},
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `studyforge_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importUserDataFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed.subjects && !parsed.goals && !parsed.sessions) {
          throw new Error('Invalid backup file format.');
        }
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
}
