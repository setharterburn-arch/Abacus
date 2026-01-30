import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../services/store';
import {
  getCurriculum,
  getTopics,
  createSkill,
  updateSkill,
  deleteSkill,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  clearCurriculumCache
} from '../services/curriculumService';

const AdminCurriculum = () => {
  const { state } = useStore();
  const navigate = useNavigate();
  
  // Data state
  const [skills, setSkills] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [gradeFilter, setGradeFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI state
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  // Auth check
  useEffect(() => {
    if (!state.loading && state.profile?.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [state.profile, state.loading, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [curriculumData, topicsList] = await Promise.all([
        getCurriculum(),
        getTopics()
      ]);
      setSkills(curriculumData);
      setTopics(topicsList);
    } catch (error) {
      console.error('Failed to load curriculum:', error);
      showMessage('Failed to load curriculum', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Filter skills
  const filteredSkills = skills.filter(skill => {
    const matchesGrade = gradeFilter === 'all' || skill.grade_level === parseInt(gradeFilter);
    const matchesTopic = topicFilter === 'all' || skill.topic === topicFilter;
    const matchesSearch = !searchQuery || 
      skill.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.id?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesTopic && matchesSearch;
  });

  // CRUD handlers
  const handleCreateSkill = async (skillData) => {
    setSaving(true);
    try {
      await createSkill(skillData);
      clearCurriculumCache();
      await loadData();
      setShowAddSkill(false);
      showMessage('Skill created successfully');
    } catch (error) {
      console.error('Failed to create skill:', error);
      showMessage('Failed to create skill: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSkill = async (skillId, updates) => {
    setSaving(true);
    try {
      await updateSkill(skillId, updates);
      clearCurriculumCache();
      await loadData();
      setEditingSkill(null);
      // Update selected skill if it was the one edited
      if (selectedSkill?.id === skillId) {
        const updated = skills.find(s => s.id === skillId);
        setSelectedSkill({ ...updated, ...updates });
      }
      showMessage('Skill updated successfully');
    } catch (error) {
      console.error('Failed to update skill:', error);
      showMessage('Failed to update skill: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!confirm('Delete this skill and all its questions? This cannot be undone.')) return;
    
    setSaving(true);
    try {
      await deleteSkill(skillId);
      clearCurriculumCache();
      await loadData();
      if (selectedSkill?.id === skillId) setSelectedSkill(null);
      showMessage('Skill deleted');
    } catch (error) {
      console.error('Failed to delete skill:', error);
      showMessage('Failed to delete skill: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuestion = async (skillId, questionData) => {
    setSaving(true);
    try {
      await addQuestion(skillId, questionData);
      clearCurriculumCache();
      await loadData();
      // Refresh selected skill
      const updated = (await getCurriculum()).find(s => s.id === skillId);
      setSelectedSkill(updated);
      setShowAddQuestion(false);
      showMessage('Question added');
    } catch (error) {
      console.error('Failed to add question:', error);
      showMessage('Failed to add question: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateQuestion = async (questionId, updates) => {
    setSaving(true);
    try {
      await updateQuestion(questionId, updates);
      clearCurriculumCache();
      await loadData();
      // Refresh selected skill
      if (selectedSkill) {
        const updated = (await getCurriculum()).find(s => s.id === selectedSkill.id);
        setSelectedSkill(updated);
      }
      setEditingQuestion(null);
      showMessage('Question updated');
    } catch (error) {
      console.error('Failed to update question:', error);
      showMessage('Failed to update question: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm('Delete this question?')) return;
    
    setSaving(true);
    try {
      await deleteQuestion(questionId);
      clearCurriculumCache();
      await loadData();
      // Refresh selected skill
      if (selectedSkill) {
        const updated = (await getCurriculum()).find(s => s.id === selectedSkill.id);
        setSelectedSkill(updated);
      }
      showMessage('Question deleted');
    } catch (error) {
      console.error('Failed to delete question:', error);
      showMessage('Failed to delete question: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</div>
        Loading curriculum...
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '1400px' }}>
      {/* Message toast */}
      {message && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          background: message.type === 'error' ? '#fee2e2' : '#dcfce7',
          color: message.type === 'error' ? '#dc2626' : '#16a34a',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          fontWeight: '500'
        }}>
          {message.text}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button onClick={() => navigate('/admin')} className="btn" style={{ marginRight: '1rem' }}>
            ← Back to Admin
          </button>
          <h1 style={{ display: 'inline', margin: 0 }}>📚 Curriculum Manager</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" onClick={() => setShowAddSkill(true)}>
            ➕ Add Skill
          </button>
          <button className="btn" onClick={() => navigate('/admin/curriculum-generator')}>
            🤖 AI Generator
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div className="card" style={{ padding: '1rem', textAlign: 'center', minWidth: '120px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{skills.length}</div>
          <div style={{ fontSize: '0.85rem', color: 'gray' }}>Total Skills</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center', minWidth: '120px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
            {skills.reduce((sum, s) => sum + (s.questions?.length || 0), 0)}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'gray' }}>Total Questions</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center', minWidth: '120px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{topics.length}</div>
          <div style={{ fontSize: '0.85rem', color: 'gray' }}>Topics</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center', minWidth: '120px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{filteredSkills.length}</div>
          <div style={{ fontSize: '0.85rem', color: 'gray' }}>Filtered</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ fontSize: '0.85rem', color: 'gray', display: 'block', marginBottom: '0.25rem' }}>Search</label>
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'gray', display: 'block', marginBottom: '0.25rem' }}>Grade</label>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="all">All Grades</option>
              <option value="0">Kindergarten</option>
              {[1,2,3,4,5,6,7,8,9].map(g => (
                <option key={g} value={g}>Grade {g}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'gray', display: 'block', marginBottom: '0.25rem' }}>Topic</label>
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="all">All Topics</option>
              {topics.sort().map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <button className="btn" onClick={() => { setGradeFilter('all'); setTopicFilter('all'); setSearchQuery(''); }}>
            Clear
          </button>
        </div>
      </div>

      {/* Main content - split view */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedSkill ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        {/* Skills list */}
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Skills ({filteredSkills.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '600px', overflowY: 'auto' }}>
            {filteredSkills.map(skill => (
              <div
                key={skill.id}
                className="card"
                onClick={() => setSelectedSkill(skill)}
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  border: selectedSkill?.id === skill.id ? '2px solid var(--color-primary)' : '1px solid #eee',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>{skill.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'gray' }}>{skill.description?.slice(0, 80)}{skill.description?.length > 80 ? '...' : ''}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem', marginLeft: '0.5rem' }}>
                    <span className="badge" style={{ background: '#e3f2fd', color: '#1565c0', fontSize: '0.7rem' }}>
                      {skill.grade_level === 0 ? 'K' : `G${skill.grade_level}`}
                    </span>
                    <span className="badge" style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '0.7rem' }}>
                      {skill.questions?.length || 0}q
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill detail panel */}
        {selectedSkill && (
          <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '1rem', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>{selectedSkill.title}</h3>
              <button onClick={() => setSelectedSkill(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>

            {/* Skill info */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ color: 'gray', marginBottom: '0.5rem' }}>{selectedSkill.description}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span className="badge" style={{ background: '#e3f2fd', color: '#1565c0' }}>
                  Grade {selectedSkill.grade_level === 0 ? 'K' : selectedSkill.grade_level}
                </span>
                <span className="badge" style={{ background: '#f3e5f5', color: '#7b1fa2' }}>
                  {selectedSkill.topic}
                </span>
                <span className="badge" style={{ background: '#fff3e0', color: '#e65100' }}>
                  {selectedSkill.difficulty}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn" onClick={() => setEditingSkill(selectedSkill)}>✏️ Edit Skill</button>
                <button className="btn" onClick={() => handleDeleteSkill(selectedSkill.id)} style={{ color: '#dc2626' }}>🗑️ Delete</button>
              </div>
            </div>

            {/* Questions */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0 }}>Questions ({selectedSkill.questions?.length || 0})</h4>
                <button className="btn btn-primary" onClick={() => setShowAddQuestion(true)} style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
                  ➕ Add
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedSkill.questions?.map((q, idx) => (
                  <div key={q.id || idx} style={{ background: 'var(--color-bg)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem' }}>
                    <div style={{ marginBottom: '0.5rem' }}>{q.question}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'gray', fontSize: '0.8rem' }}>
                        Answer: <strong>{String(q.answer)}</strong>
                        {q.type && q.type !== 'multiple_choice' && (
                          <span className="badge" style={{ marginLeft: '0.5rem', background: '#fff3e0', color: '#e65100', fontSize: '0.7rem' }}>
                            {q.type}
                          </span>
                        )}
                      </span>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button 
                          onClick={() => setEditingQuestion({ ...q, index: idx })} 
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDeleteQuestion(q.id)} 
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {(!selectedSkill.questions || selectedSkill.questions.length === 0) && (
                  <p style={{ color: 'gray', textAlign: 'center', padding: '2rem' }}>No questions yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Skill Modal */}
      {showAddSkill && (
        <SkillModal
          onSave={handleCreateSkill}
          onClose={() => setShowAddSkill(false)}
          topics={topics}
          saving={saving}
        />
      )}

      {/* Edit Skill Modal */}
      {editingSkill && (
        <SkillModal
          skill={editingSkill}
          onSave={(data) => handleUpdateSkill(editingSkill.id, data)}
          onClose={() => setEditingSkill(null)}
          topics={topics}
          saving={saving}
        />
      )}

      {/* Add Question Modal */}
      {showAddQuestion && selectedSkill && (
        <QuestionModal
          onSave={(data) => handleAddQuestion(selectedSkill.id, data)}
          onClose={() => setShowAddQuestion(false)}
          saving={saving}
        />
      )}

      {/* Edit Question Modal */}
      {editingQuestion && (
        <QuestionModal
          question={editingQuestion}
          onSave={(data) => handleUpdateQuestion(editingQuestion.id, data)}
          onClose={() => setEditingQuestion(null)}
          saving={saving}
        />
      )}
    </div>
  );
};

// Skill Modal Component
const SkillModal = ({ skill, onSave, onClose, topics, saving }) => {
  const [formData, setFormData] = useState({
    id: skill?.id || '',
    title: skill?.title || '',
    description: skill?.description || '',
    grade_level: skill?.grade_level ?? 1,
    topic: skill?.topic || topics[0] || 'General',
    difficulty: skill?.difficulty || 'medium'
  });
  const [newTopic, setNewTopic] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert('Title is required');
    if (!skill && !formData.id.trim()) return alert('ID is required');
    
    const data = { ...formData };
    if (newTopic) data.topic = newTopic;
    if (skill) delete data.id; // Don't update ID
    
    onSave(data);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>{skill ? 'Edit Skill' : 'Add New Skill'}</h2>
        <form onSubmit={handleSubmit}>
          {!skill && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>ID (unique)</label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="e.g., grade-3-fractions-basics"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              />
            </div>
          )}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Add fractions with like denominators"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the skill"
              rows={3}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Grade</label>
              <select
                value={formData.grade_level}
                onChange={(e) => setFormData({ ...formData, grade_level: parseInt(e.target.value) })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="0">Kindergarten</option>
                {[1,2,3,4,5,6,7,8,9].map(g => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Topic</label>
            <select
              value={newTopic ? '_new' : formData.topic}
              onChange={(e) => {
                if (e.target.value === '_new') {
                  setNewTopic('');
                } else {
                  setFormData({ ...formData, topic: e.target.value });
                  setNewTopic('');
                }
              }}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '0.5rem' }}
            >
              {topics.sort().map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
              <option value="_new">+ New Topic</option>
            </select>
            {(newTopic !== '' || formData.topic === '_new') && (
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="Enter new topic name"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            )}
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : (skill ? 'Save Changes' : 'Create Skill')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Question Modal Component
const QuestionModal = ({ question, onSave, onClose, saving }) => {
  const [formData, setFormData] = useState({
    question: question?.question || '',
    type: question?.type || 'multiple_choice',
    options: question?.options || ['', '', '', ''],
    answer: question?.answer || '',
    explanation: question?.explanation || '',
    hint: question?.hint || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.question.trim()) return alert('Question is required');
    if (!formData.answer.trim()) return alert('Answer is required');
    
    const data = {
      question: formData.question,
      type: formData.type,
      answer: formData.answer,
      explanation: formData.explanation || null,
      hint: formData.hint || null
    };
    
    if (formData.type === 'multiple_choice' && formData.options.some(o => o.trim())) {
      data.options = formData.options.filter(o => o.trim());
    }
    
    onSave(data);
  };

  const updateOption = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>{question ? 'Edit Question' : 'Add New Question'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Question</label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Enter the question text"
              rows={3}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="multiple_choice">Multiple Choice</option>
              <option value="number-line">Number Line</option>
              <option value="fraction-shade">Fraction Shade</option>
              <option value="drag-sort">Drag & Sort</option>
              <option value="array-builder">Array Builder</option>
            </select>
          </div>
          {formData.type === 'multiple_choice' && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Options</label>
              {formData.options.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '0.5rem' }}
                />
              ))}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, options: [...formData.options, ''] })}
                style={{ fontSize: '0.85rem', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                + Add Option
              </button>
            </div>
          )}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Correct Answer</label>
            <input
              type="text"
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="The correct answer"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Explanation (optional)</label>
            <textarea
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              placeholder="Explain why this is the correct answer"
              rows={2}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Hint (optional)</label>
            <input
              type="text"
              value={formData.hint}
              onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
              placeholder="A helpful hint for students"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : (question ? 'Save Changes' : 'Add Question')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCurriculum;
