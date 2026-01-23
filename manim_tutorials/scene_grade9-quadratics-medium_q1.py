from manim import *

class Grade9QuadraticsMedium(Scene):
    def construct(self):
        # Equation
        equation = MathTex("x^2 - 5x + 6 = 0").to_edge(UP)
        self.play(Write(equation))
        self.wait(1)

        # Factoring
        factoring = MathTex("(x - 2)(x - 3) = 0").next_to(equation, DOWN)
        self.play(Write(factoring))
        self.wait(1)

        # Setting factors to zero
        factor1 = MathTex("x - 2 = 0").next_to(factoring, DOWN, aligned_edge=LEFT)
        factor2 = MathTex("x - 3 = 0").next_to(factor1, DOWN, aligned_edge=LEFT)
        self.play(Write(factor1), Write(factor2))
        self.wait(1)

        # Solutions
        solution1 = MathTex("x = 2").next_to(factor1, RIGHT)
        solution2 = MathTex("x = 3").next_to(factor2, RIGHT)
        self.play(Write(solution1), Write(solution2))
        self.wait(2)