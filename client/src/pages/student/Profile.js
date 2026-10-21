import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { studentAPI, skillAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { UserCircleIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/LoadingSpinner';

const Profile = () => {
  const queryClient = useQueryClient();
  const [skillForm, setSkillForm] = useState({ skillId: '', proficiencyLevel: 'beginner', yearsOfExperience: 0 });

  const { data: profileData, isLoading: isProfileLoading } = useQuery(
    'studentProfile',
    studentAPI.getProfile
  );

  const { data: allSkillsData, isLoading: isSkillsLoading } = useQuery(
    'allSkills',
    skillAPI.getAll,
    {
      onSuccess: (data) => {
        if (data && data.data && data.data.length > 0 && !skillForm.skillId) {
          setSkillForm(prev => ({ ...prev, skillId: data.data[0].skill_id }));
        }
      }
    }
  );

  const addSkillMutation = useMutation(
    (newSkill) => studentAPI.addSkill(newSkill),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('studentProfile');
        toast.success('Skill added successfully!');
      },
      onError: () => toast.error('Failed to add skill')
    }
  );

  const removeSkillMutation = useMutation(
    (skillId) => studentAPI.removeSkill(skillId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('studentProfile');
        toast.success('Skill removed successfully!');
      },
      onError: () => toast.error('Failed to remove skill')
    }
  );

  if (isProfileLoading || isSkillsLoading) return <LoadingSpinner text="Loading profile..." />;

  const profile = profileData?.data || profileData;
  const skills = profile?.StudentSkills || [];
  const allSkills = allSkillsData?.data || allSkillsData || [];

  const handleAddSkill = (e) => {
    e.preventDefault();
    addSkillMutation.mutate({
      skillId: parseInt(skillForm.skillId),
      proficiencyLevel: skillForm.proficiencyLevel,
      yearsOfExperience: parseInt(skillForm.yearsOfExperience)
    });
  };

  return (
    <div className="space-y-8">
      <div className="glass-panel p-8 flex items-center space-x-6">
        <UserCircleIcon className="h-20 w-20 text-indigo-500" />
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {profile?.first_name} {profile?.last_name}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {profile?.current_education_level || 'Student'}
          </p>
        </div>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Manage Skills</h2>
        
        <form onSubmit={handleAddSkill} className="flex gap-4 items-end mb-8 bg-white/40 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Skill</label>
            <select 
              required
              className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 p-2 border"
              value={skillForm.skillId}
              onChange={e => setSkillForm({...skillForm, skillId: e.target.value})}
            >
              {allSkills.map(s => (
                <option key={s.skill_id} value={s.skill_id}>{s.skill_name} ({s.category})</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Proficiency</label>
            <select 
              className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 p-2 border"
              value={skillForm.proficiencyLevel}
              onChange={e => setSkillForm({...skillForm, proficiencyLevel: e.target.value})}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Years Experience</label>
            <input 
              type="number" min="0" required
              className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 p-2 border"
              value={skillForm.yearsOfExperience}
              onChange={e => setSkillForm({...skillForm, yearsOfExperience: e.target.value})}
            />
          </div>
          <button type="submit" className="btn-primary h-[42px] flex items-center justify-center">
            <PlusIcon className="w-5 h-5 mr-1" /> Add Skill
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map(skill => (
            <div key={skill.skill_id} className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white capitalize">{skill.Skill?.skill_name || `Skill #${skill.skill_id}`}</h4>
                <p className="text-sm text-slate-500 capitalize">{skill.proficiency_level} • {skill.years_of_experience} yrs</p>
              </div>
              <button 
                onClick={() => removeSkillMutation.mutate(skill.skill_id)}
                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
          {skills.length === 0 && (
            <p className="text-slate-500 dark:text-slate-400 col-span-full">No skills added yet. Add your first skill above!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
