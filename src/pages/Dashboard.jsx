import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';

const Dashboard = () => {
    const { state } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!state.loading && !state.session) {
            navigate('/auth');
        }
    }, [state.loading, state.session, navigate]);

    if (state.loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
    }

    if (!state.profile) return null;

    return (
        <div>
            {state.profile.role === 'teacher' ? (
                <TeacherDashboard profile={state.profile} />
            ) : (
                <StudentDashboard profile={state.profile} />
            )}
        </div>
    );
};

export default Dashboard;
