from manim import * 

class Grade7RatiosMedium0(Scene):
    def construct(self):
        flour_eggs_ratio = MathTex(r'\frac{2 \text{ cups flour}}{3 \text{ eggs}} = \frac{x \text{ cups flour}}{6 \text{ eggs}}').to_edge(UP)
        self.play(Write(flour_eggs_ratio))

        cross_multiply = MathTex(r'2 \times 6 = 3 \times x').next_to(flour_eggs_ratio, DOWN, buff=0.5)
        self.play(Write(cross_multiply))

        simplify = MathTex(r'12 = 3x').next_to(cross_multiply, DOWN, buff=0.5)
        self.play(Write(simplify))

        solve_for_x = MathTex(r'x = \frac{12}{3} = 4').next_to(simplify, DOWN, buff=0.5)
        self.play(Write(solve_for_x))

        answer = MathTex(r'4 \text{ cups of flour are needed}').next_to(solve_for_x, DOWN, buff=0.5)
        self.play(Write(answer))

        self.wait(3)