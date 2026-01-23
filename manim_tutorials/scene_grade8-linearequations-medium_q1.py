from manim import *

class Grade8LinearEquationsMedium(Scene):
    def construct(self):
        # Equation
        equation = MathTex("3x + 5 = 14").to_edge(UP)
        self.play(Write(equation))
        self.wait(1)

        # Subtract 5 from both sides
        subtract_5 = MathTex("3x + 5 - 5 = 14 - 5").next_to(equation, DOWN)
        self.play(Write(subtract_5))
        self.wait(1)

        # Simplified Equation
        simplified_equation = MathTex("3x = 9").next_to(subtract_5, DOWN)
        self.play(Write(simplified_equation))
        self.wait(1)

        # Divide by 3
        divide_by_3 = MathTex("\frac{3x}{3} = \frac{9}{3}").next_to(simplified_equation, DOWN)
        self.play(Write(divide_by_3))
        self.wait(1)

        # Solution
        solution = MathTex("x = 3").next_to(divide_by_3, DOWN)
        self.play(Write(solution))
        self.wait(2)