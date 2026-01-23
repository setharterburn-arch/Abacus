from manim import * 

class Grade7RatiosMedium1(Scene):
    def construct(self):
        boys_girls_ratio = MathTex(r'\frac{3 \text{ boys}}{5 \text{ girls}} = \frac{15 \text{ boys}}{x \text{ girls}}').to_edge(UP)
        self.play(Write(boys_girls_ratio))

        cross_multiply = MathTex(r'3 \times x = 5 \times 15').next_to(boys_girls_ratio, DOWN, buff=0.5)
        self.play(Write(cross_multiply))

        simplify = MathTex(r'3x = 75').next_to(cross_multiply, DOWN, buff=0.5)
        self.play(Write(simplify))

        solve_for_x = MathTex(r'x = \frac{75}{3} = 25').next_to(simplify, DOWN, buff=0.5)
        self.play(Write(solve_for_x))

        answer = MathTex(r'25 \text{ girls are there}').next_to(solve_for_x, DOWN, buff=0.5)
        self.play(Write(answer))

        self.wait(3)