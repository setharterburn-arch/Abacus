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

    if (state.profile.role === 'admin') {
        return (
            <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>Admin Dashboard</h1>
                <p>Welcome, Administrator.</p>
                <button className="btn btn-primary" onClick={() => navigate('/admin')}>
                    Go to Admin Portal
                </button>
            </div>
        );
    }

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
