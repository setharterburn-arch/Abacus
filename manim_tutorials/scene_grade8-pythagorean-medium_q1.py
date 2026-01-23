from manim import *

class Grade8PythagoreanMedium(Scene):
    def construct(self):
        # Triangle
        triangle = Polygon([0, 0, 0], [4, 0, 0], [4, 3, 0], stroke_color=WHITE, fill_opacity=0)
        self.play(Create(triangle))
        self.wait(0.5)

        # Side lengths
        a_label = MathTex("a = 3").next_to(triangle, LEFT)
        b_label = MathTex("b = 4").next_to(triangle, DOWN)
        c_label = MathTex("c = ?").next_to(triangle, RIGHT)
        self.play(Write(a_label), Write(b_label), Write(c_label))
        self.wait(1)

        # Pythagorean Theorem formula
        pythagorean_formula = MathTex("a^2 + b^2 = c^2").to_edge(UP)
        self.play(Write(pythagorean_formula))
        self.wait(1)

        # Substitution
        substitution = MathTex("3^2 + 4^2 = c^2").next_to(pythagorean_formula, DOWN)
        self.play(Write(substitution))
        self.wait(1)

        # Simplification
        simplification = MathTex("9 + 16 = c^2").next_to(substitution, DOWN)
        self.play(Write(simplification))
        self.wait(1)

        # Further Simplification
        further_simplification = MathTex("25 = c^2").next_to(simplification, DOWN)
        self.play(Write(further_simplification))
        self.wait(1)

        # Solution
        solution = MathTex("c = 5").next_to(further_simplification, DOWN)
        self.play(Write(solution))
        self.wait(2)